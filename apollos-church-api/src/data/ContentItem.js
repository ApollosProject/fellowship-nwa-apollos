import { gql } from 'apollo-server';
import { ContentItem } from '@apollosproject/data-connector-rock';
import ApollosConfig from '@apollosproject/config';

const schema = gql`
  ${ContentItem.schema}

  extend type ContentItemsConnection @cacheControl(scope: PRIVATE)
`;

const resolver = {
  ...ContentItem.resolver,
  WeekendContentItem: {
    ...ContentItem.resolver.WeekendContentItem,
    htmlContent: (item, _, { dataSources }) =>
      `${dataSources.ContentItem.createHtmlHeader(
        item
      )}${dataSources.ContentItem.createHTMLContent(
        item.attributeValues.summary?.value
      )}${dataSources.ContentItem.createHTMLFooter(item)}`,
  },
  UniversalContentItem: {
    ...ContentItem.resolver.UniversalContentItem,
    htmlContent: ({ content, attributeValues }, _, { dataSources }) =>
      dataSources.ContentItem.createHTMLContent(
        attributeValues.description?.value || content
      ),
  },
  ContentSeriesContentItem: {
    ...ContentItem.resolver.ContentSeriesContentItem,
    htmlContent: ({ content, attributeValues }, _, { dataSources }) =>
      dataSources.ContentItem.createHTMLContent(
        attributeValues.description?.value || content
      ),
  },
};

class dataSource extends ContentItem.dataSource {
  baseItemByChannelCursor = this.byContentChannelId;

  _coreCreateSummary = this.createSummary;

  createSummary = ({ attributeValues, ...other }) => {
    if (attributeValues?.description?.value)
      return attributeValues.description.value;
    return this._coreCreateSummary({ attributeValues, ...other });
  };

  byContentChannelId = async (id, category = '') => {
    const { Auth, Campus } = this.context.dataSources;

    const person = await Auth.getCurrentPerson();
    const { name = '', guid: campusGuid } = await Campus.getForPerson({
      id: person.id,
    });
    // 10 - sermons
    // Congregation attribute returns the lowercase, hyphenated campus name
    // Service attribute - we only want "adult" services
    if (id === 10) {
      const congregationAttributeValues = await this.request('AttributeValues')
        .filter(
          `AttributeId eq 8701 and Value eq '${name
            .toLowerCase()
            .replace(' ', '-')}'`
        )
        .cache({ ttl: 60 })
        .get();
      const serviceAttributeValues = await this.request('AttributeValues')
        .filter(`AttributeId eq 8702 and Value eq 'adults'`)
        .cache({ ttl: 60 })
        .get();
      const sermonAttributeValues = congregationAttributeValues.filter(
        ({ entityId }) =>
          serviceAttributeValues.map((attr) => attr.entityId).includes(entityId)
      );
      return this.getFromIds(sermonAttributeValues.map((attr) => attr.entityId))
        .andFilter(`ContentChannelId eq ${id}`)
        .cache({ ttl: 60 })
        .orderBy('StartDateTime', 'desc');
    }

    // 19 - News Highlights
    // 11 - Website Promotions
    // Campus attribute (10878 for 19, 5083 for 11) returns a string list of campus guids
    // Category attribute returns a guid from the Website Promotion Category defined type
    if (id === 19 || id === 11) {
      const campusAttributeValues = await this.request('AttributeValues')
        .filter(
          `(AttributeId eq 10878 or AttributeId eq 5083) and substringof('${campusGuid}', Value)`
        )
        .cache({ ttl: 60 })
        .get();
      let attributeValues = [];
      if (category) {
        const categories = await this.request('DefinedValues')
          .filter('DefinedTypeId eq 136')
          .cache({ ttl: 60 })
          .get();
        const { guid } = categories.find(({ value }) => value === category);
        const categoryAttributeValues = await this.request('AttributeValues')
          .filter(`AttributeId eq 10269 and Value eq '${guid}'`)
          .cache({ ttl: 60 })
          .get();
        attributeValues = campusAttributeValues.filter(({ entityId }) =>
          categoryAttributeValues
            .map((attr) => attr.entityId)
            .includes(entityId)
        );
      } else attributeValues = campusAttributeValues;
      return this.getFromIds(attributeValues.map((attr) => attr.entityId))
        .andFilter(`ContentChannelId eq ${id}`)
        .cache({ ttl: 60 })
        .orderBy('StartDateTime', 'desc');
    }
    return this.baseItemByChannelCursor(id);
  };

  baseCursorByChild = this.getCursorByChildContentItemId;

  getCursorByChildContentItemId = async (id) => {
    const child = await this.getFromId(id);

    if (!child.attributeValues?.series?.value)
      return this.baseCursorByChild(id);

    return this.request().filter(
      `Guid eq guid'${child.attributeValues.series.value}'`
    );
  };

  baseCursorByParent = this.getCursorByParentContentItemId;

  getCursorByParentContentItemId = async (parentId) => {
    const { Auth, Campus } = this.context.dataSources;
    const person = await Auth.getCurrentPerson();
    const { name = '' } = await Campus.getForPerson({ id: person.id });
    const parent = await this.getFromId(parentId);

    // filter by series
    const seriesAttributes = await this.request('AttributeValues')
      .filter(`Value eq '${parent.guid}' and AttributeId eq 5225`)
      .get();
    const seriesItemIds = seriesAttributes.map(({ entityId }) => entityId);

    // if there are no series items, it probably means they've set up the
    // channel like we're expecting
    if (!seriesItemIds.length) return this.baseCursorByParent(parentId);

    // filter by campus
    const campusAttributes = await this.request('AttributeValues')
      .filter(
        `Value eq '${name
          .toLowerCase()
          .replace(' ', '-')}' and AttributeId eq 8701`
      )
      .get();
    const campusItemIds = campusAttributes.map(({ entityId }) => entityId);

    // put them together
    const ids = seriesItemIds.filter((id) => campusItemIds.includes(id));
    return this.getFromIds(ids).sort(this.DEFAULT_SORT());
  };

  baseCursorBySibling = this.getCursorBySiblingContentItemId;

  getCursorBySiblingContentItemId = async (siblingId) => {
    const { Auth, Campus } = this.context.dataSources;
    const person = await Auth.getCurrentPerson();
    const { name = '' } = await Campus.getForPerson({ id: person.id });
    const sibling = await this.getFromId(siblingId);

    // filter by series
    const seriesAttributes = await this.request('AttributeValues')
      .filter(
        `Value eq '${
          sibling.attributeValues?.series?.value
        }' and AttributeId eq 5225`
      )
      .get();
    const seriesItemIds = seriesAttributes.map(({ entityId }) => entityId);

    // if there are no series items, it probably means they've set up the
    // channel like we're expecting
    if (!seriesItemIds.length) return this.baseCursorBySibling(siblingId);

    // filter by campus
    const campusAttributes = await this.request('AttributeValues')
      .filter(
        `Value eq '${name
          .toLowerCase()
          .replace(' ', '-')}' and AttributeId eq 8701`
      )
      .get();
    const campusItemIds = campusAttributes.map(({ entityId }) => entityId);

    // put them together
    const ids = seriesItemIds.filter((id) => campusItemIds.includes(id));
    return this.getFromIds(ids).sort(this.DEFAULT_SORT());
  };

  getFeatures = async (item) => {
    const features = await super.getFeatures(item);
    const { Feature, Matrix, BinaryFiles } = this.context.dataSources;

    // relatedFilesorLinks
    const resources = await Matrix.getItemsFromGuid(
      item.attributeValues.relatedFilesorLinks?.value
    );
    if (resources.length) {
      const actions = await Promise.all(
        resources.map(
          async ({ attributeValues: { linkName, linkUrl, file } }) => {
            let url = '';
            if (linkUrl.value) {
              url = ApollosConfig.ROCK.URL + linkUrl.value;
            } else if (file.value) {
              const blob = await BinaryFiles.request()
                .filter(`Guid eq guid'${file.value}'`)
                .first();
              url = blob.url;
            }
            return {
              title: linkName.value,
              action: 'OPEN_URL',
              relatedNode: { __typename: 'Url', url },
            };
          }
        )
      );
      features.push(
        Feature.createActionTableFeature({
          title: 'Resources',
          actions,
        })
      );
    }

    // sign up button
    const signupURL = `${process.env.ROCK_URL}${
      item.attributeValues.registrationLinkUrl?.value
    }`;
    if (item.attributeValues.registrationLinkUrl?.value) {
      features.push(
        Feature.createButtonFeature({
          id: item.attributeValues.registrationLinkUrl.id,
          action: Feature.attachActionIds({
            relatedNode: {
              __typename: 'Url',
              url: signupURL,
            },
            action: 'OPEN_AUTHENTICATED_URL',
            title: 'Sign Up',
          }),
        })
      );
    }

    // generic link button (used for podcasts)
    const linkUrl = item.attributeValues.linkUrl?.value;
    if (linkUrl) {
      features.push(
        Feature.createButtonFeature({
          id: linkUrl,
          action: Feature.attachActionIds({
            relatedNode: {
              __typename: 'Url',
              url: linkUrl,
            },
            action: 'OPEN_URL',
            title: item.attributeValues.linkText?.value || 'Open',
          }),
        })
      );
    }

    return features;
  };

  createHtmlHeader = (item) => {
    let header = '';
    if (!item.attributeValues.resiVodurl?.value) {
      if (item.attributeValues.vimeoId?.value) {
        header = `${header}<a href="https://vimeo.com/${
          item.attributeValues.vimeoId?.value
        }">Watch on Vimeo</a>`;
      } else if (item.attributeValues.youtubeId?.value) {
        header = `${header}<a href="https://www.youtube.com/watch?v=${
          item.attributeValues.youtubeId?.value
        }">Watch on YouTube</a>`;
      }
    }

    if (header !== '' && item.attributeValues.summary.value !== '') {
      // Checks for Vimeo or YouTube link and Summary content
      header = `<p>${header}</p><h3>About this Message</h3>`;
    } else if (item.attributeValues.summary.value !== '') {
      // Checks for Summary content
      header = `<h3>About this Message</h3>`;
    }

    return header;
  };

  createHTMLFooter = (item) => {
    if (item.attributeValues.discussionGuide?.value)
      return `<p><h3>Discussion Guide</h3>${
        item.attributeValues.discussionGuide.value
      }</p>`;
    return '';
  };
}

export { schema, resolver, dataSource };
