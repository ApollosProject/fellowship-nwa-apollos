import { ActionAlgorithm } from '@apollosproject/data-connector-rock';
import { format, isThisWeek } from 'date-fns';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    PRIORITY_CONTENT_FEED: this.priorityContentFeedAlgorithm.bind(this),
    WEEKLY_SCRIPTURE_FEED: this.weeklyScriptureFeedAlgorithm.bind(this),
  };

  async contentFeedAlgorithm({
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
      subtitle: item.contentChannel?.name,
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
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
          .top(limit)
          .skip(skip)
          .sort([{ field: 'StartDateTime', direction: 'asc' }])
          .get()
      )
    )).flat();

    const itemsByDate = items.filter((key) =>
      isThisWeek(new Date(key.startDateTime), 1)
    );

    return itemsByDate.map((item, i) => ({
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
