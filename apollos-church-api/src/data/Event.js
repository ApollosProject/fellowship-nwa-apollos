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
  getEvents = ({ limit = 10, ministry }) =>
    this.findRecent()
      .top(limit)
      .get();
}
