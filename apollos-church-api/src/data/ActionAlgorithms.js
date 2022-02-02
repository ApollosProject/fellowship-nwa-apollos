import { ActionAlgorithm } from '@apollosproject/data-connector-rock';
import {
  format,
  formatISO,
  previousSunday,
  nextMonday,
  startOfToday,
} from 'date-fns';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    PRIORITY_CONTENT_FEED: this.priorityContentFeedAlgorithm.bind(this),
    SINGLE_CONTENT_ITEM_BY_ID: this.singleContentItemByIdAlgorithm.bind(this),
    WEEKLY_SCRIPTURE_FEED: this.weeklyScriptureFeedAlgorithm.bind(this),
  };

  async contentFeedAlgorithm({
    subtitle = '',
    category = '',
    channelIds = [],
    limit = 20,
    skip = 0,
  } = {}) {
    const { ContentItem } = this.context.dataSources;

    const items = (await Promise.all(
      channelIds.map(async (channel) =>
        (await ContentItem.byContentChannelId(channel, category))
          .top(limit)
          .skip(skip)
          .get()
      )
    )).flat();

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: item.contentChannel?.name || subtitle,
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary:
        subtitle === "Today's Reading"
          ? format(new Date(item.startDateTime), 'E, MMM d')
          : ContentItem.createSummary(item),
    }));
  }

  async singleContentItemByIdAlgorithm({
    subtitle = '',
    itemRockId = '',
  } = {}) {
    const { ContentItem } = this.context.dataSources;

    const item = await ContentItem.getFromId(`${itemRockId}`);

    return {
      id: `${item.id}`,
      title: item.title,
      subtitle: item.contentChannel?.name || subtitle,
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    };
  }

  async priorityContentFeedAlgorithm({
    category = '',
    channelIds = [],
    limit = 20,
    skip = 0,
  } = {}) {
    const { ContentItem } = this.context.dataSources;

    const items = (await Promise.all(
      channelIds.map(async (channel) =>
        (await ContentItem.byContentChannelId(channel, category))
          .top(limit)
          .skip(skip)
          .sort([{ field: 'Priority', direction: 'asc' }])
          .get()
      )
    )).flat();

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: item.contentChannel?.name,
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  async weeklyScriptureFeedAlgorithm({
    category = '',
    channelIds = [],
    limit = 5,
    skip = 0,
  } = {}) {
    const { ContentItem } = this.context.dataSources;

    const items = (await Promise.all(
      channelIds.map(async (channel) =>
        (await ContentItem.byContentChannelId(channel, category, false))
          .sort([{ field: 'StartDateTime', direction: 'asc' }])
          .andFilter(
            `((StartDateTime gt datetime'${formatISO(
              previousSunday(startOfToday())
            )}') and (StartDateTime lt datetime'${formatISO(
              nextMonday(startOfToday())
            )}'))`
          )
          .top(limit)
          .skip(skip)
          .get()
      )
    )).flat();

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: format(new Date(item.startDateTime), 'E, MMM d') || '',
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }
}

export { dataSource };
