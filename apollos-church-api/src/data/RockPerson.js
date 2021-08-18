import { Person } from '@apollosproject/data-connector-rock';

const { schema, resolver } = Person;

class dataSource extends Person.dataSource {
  create = (profile) => {
    const rockUpdateFields = this.mapApollosFieldsToRock(profile);
    return this.post('/People', {
      Gender: 0, // required by Rock. Listed first so it can be overridden.
      IsSystem: false, // required by rock
      ...rockUpdateFields,
    });
  };
}

export { schema, resolver, dataSource };
