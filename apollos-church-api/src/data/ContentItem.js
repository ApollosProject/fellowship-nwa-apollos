import { ContentItem } from '@apollosproject/data-connector-rock';
// import ApollosConfig from '@apollosproject/config';
// import sanitizeHtml from 'sanitize-html';

const { schema, resolver } = ContentItem;

class dataSource extends ContentItem.dataSource {
  superGetCursorByChildContentItemId = this.getCursorByChildContentItemId;

  superGetCursorByParentContentItemId = this.getCursorByParentContentItemId;

  superGetCursorBySiblingContentItemId = this.getCursorBySiblingContentItemId;

  getCursorByChildContentItemId = async (id) => {
    const item = await this.getFromId(id);

    if (!item.attributeValues?.series?.value)
      return this.superGetCursorByChildContentItemId(id);

    return this.request().filter(
      `Guid eq guid'${item.attributeValues.series.value}'`
    );
  };

  getCursorByParentContentItemId = async (id) => {
    const item = await this.getFromId(id);
    const attributeValues = await this.request('AttributeValues')
      .filter(`Value eq '${item.guid}' and Attribute/Id eq 5225`)
      .get();

    return this.getFromIds(
      attributeValues.map(({ entityId }) => entityId)
    ).sort(this.DEFAULT_SORT());
  };

  getCursorBySiblingContentItemId = async (id) => {
    const item = await this.getFromId(id);
    if (!item.attributeValues?.series?.value)
      return this.superGetCursorBySiblingContentItemId(id);

    const attributeValues = await this.request('AttributeValues')
      .filter(
        `Value eq '${
          item.attributeValues?.series?.value
        }' and Attribute/Id eq 5225`
      )
      .get();

    return this.getFromIds(
      attributeValues.map(({ entityId }) => entityId)
    ).sort(this.DEFAULT_SORT());
  };

  getFeatures = async (item) => {
    const features = await super.getFeatures(item);
    const { Feature } = this.context.dataSources;

    // scripture ref
    const reference = item.attributeValues.bookoftheBible?.value;
    if (reference) {
      features.push(
        Feature.createScriptureFeature({
          reference,
          id: `${item.id}-${reference}`,
        })
      );
    }

    return features;
  };

  // createHTMLContent = (content) =>
  //   sanitizeHtml(content || '', {
  //     allowedTags: false,
  //     allowedAttributes: false,
  //     transformTags: {
  //       img: (tagName, { src }) => ({
  //         tagName,
  //         attribs: {
  //           // adds Rock URL in the case of local image references in the CMS
  //           src: src.startsWith('http')
  //             ? src
  //             : `${ApollosConfig.ROCK.URL || ''}${src}`,
  //         },
  //       }),
  //     },
  //   });
}

export { schema, resolver, dataSource };
