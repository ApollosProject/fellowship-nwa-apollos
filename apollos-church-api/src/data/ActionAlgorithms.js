import { ActionAlgorithm } from '@apollosproject/data-connector-rock';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    PRIORITY_CONTENT_FEED: this.priorityContentFeedAlgorithm.bind(this),
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
}

export { dataSource };
