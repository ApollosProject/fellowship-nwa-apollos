import { ActionAlgorithm } from '@apollosproject/data-connector-rock';

class dataSource extends ActionAlgorithm.dataSource {
  ACTION_ALGORITHMS = {
    ...this.ACTION_ALGORITHMS,
    // UPCOMING_EVENTS: this.upcomingEventsAlgorithm.bind(this),
  };

  // async upcomingEventsAlgorithm({ limit = 5 } = {}) {
  //   const { Event } = this.context.dataSources;

  //   // Get the first N items.
  //   const events = await Event.findRecent()
  //     .top(limit)
  //     .get();
  //   // Map them into specific actions.
  //   return events.map((event, i) => ({
  //     id: `${event.id}${i}`,
  //     title: Event.getName(event),
  //     subtitle: Event.getDateTime(event.schedule).start,
  //     relatedNode: { ...event, __type: 'Event' },
  //     image: Event.getImage(event),
  //     action: 'READ_EVENT',
  //     summary: '',
  //   }));
  // }

  contentFeedAlgorithm = async ({
    channelIds = [],
    limit = 20,
    skip = 0,
  } = {}) => {
    const { ContentItem, Auth, Campus } = this.context.dataSources;

    // custom, filter everything by campus
    const { id } = Auth.getCurrentPerson();
    const { id: campusId } = Campus.getForPerson({ id });
    // this is gonna give me something like Fellowship Rogers
    //
    // TODO
    // Congregation attribute value is 8701, returns values like 'fellowship-rogers'
    // I need to figure out how to the link them
    // then we could do AttributeValues.filter(8701 and value) and map the EntityId to get content items
    //
    // Campuses attribute
    const campusItems2 = await this.request(
      `Apollos/ContentChannelItemsByAttributeValue?attributeValues=${campusId}&attributeKey=CampusId`
    )
      .byContentChannelIds(channelIds)
      .top(limit)
      .skip(skip)
      .get();

    // const items = await ContentItem.byContentChannelIds(channelIds)
    // .top(limit)
    // .skip(skip)
    // .get();

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  };
}

export { dataSource };
