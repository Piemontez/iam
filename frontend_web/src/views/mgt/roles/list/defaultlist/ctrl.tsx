import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
import { RoleGraphQLDatasource } from '../../../../../datasources/apigraphql';
import { CommonListCtx } from '../../../../generic/list/ctrl';
import { ListDefinition } from '../../../../generic/list/types/ListDefinition';

export class RoleListStore extends CommonListCtx {
  defaultListDefs: ListDefinition = {
    id: 'roles_list',
    name: 'roles_list',
    filters: [{ name: 'name', title: 'Name', type: AttributeType.Text }],
    columns: [
      { colname: 'name', title: 'Name', type: AttributeType.Text, show: true },
      { colname: 'description', title: 'Description', type: AttributeType.Text, show: true },
      { colname: 'application.name', title: 'Application', type: AttributeType.Text, sortable: false },
      { colname: 'region.name', title: 'Region', type: AttributeType.Text, sortable: false },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Up,
  };

  constructor() {
    super(new RoleGraphQLDatasource(), false);

    makeObservable(this);
  }
}
