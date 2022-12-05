import { EndpointsDef } from '../endpoints';
import { GraphQLDatasource } from './api';

/**
 * Person
 */
export class PersonGraphQLDatasource extends GraphQLDatasource {
  constructor() {
    super(EndpointsDef.apiGraphQLPerson);
  }
}

/**
 * Role
 */
export class RoleGraphQLDatasource extends GraphQLDatasource {
  constructor() {
    super(EndpointsDef.apiGraphQLPerson);
  }
}

/**
 * Permission
 */
export class PermissionGraphQLDatasource extends GraphQLDatasource {
  constructor() {
    super(EndpointsDef.apiGraphQLPerson);
  }
}
