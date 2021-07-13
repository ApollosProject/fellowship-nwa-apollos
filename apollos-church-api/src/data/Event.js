import { gql } from 'apollo-server';
import { Event } from '@apollosproject/data-connector-rock';

export const schema = gql`
  extend type Query {
    getEvents(ministry: String): [Event]
  }

  ${Event.schema}
`;

export const resolver = {
  ...Event.resolver,
  Query: {
    ...Event.resolver.Query,
    getEvents: (_, { ministry }, { dataSources }) =>
      dataSources.Event.getEvents({ ministry }),
  },
};

export class dataSource extends Event.dataSource {
  getEvents = async ({ ministry }) => {
    if (!ministry) return this.findRecent().get();
    // search through available ministries
    const audiences = await this.request('DefinedValues')
      .filter('DefinedTypeId eq 99')
      .get();
    const { guid } = audiences.find((audience) => audience.value === ministry);
    if (!guid) return [];

    // get all events that match the Guid on the Ministries attribute
    const values = await this.request('AttributeValues')
      .filter(`AttributeId eq 5694 and Value eq '${guid}'`)
      .get();
    const eventCalendarItems = await Promise.all(
      values.map(async ({ entityId }) =>
        this.request('EventCalendarItems')
          .find(entityId)
          .get()
      )
    );
    const eventItems = await Promise.all(
      eventCalendarItems.map(async ({ eventItemId }) =>
        this.request('EventItems')
          .find(eventItemId)
          .get()
      )
    );
    const occurrances = await Promise.all(
      eventItems.map(async ({ id }) =>
        this.request()
          .filter(`EventItemId eq ${id}`)
          .expand('Schedule')
          .get()
      )
    );
    return occurrances.flat();
  };
}
