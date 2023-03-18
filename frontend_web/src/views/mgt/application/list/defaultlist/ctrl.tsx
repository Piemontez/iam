import { makeObservable } from 'mobx';
import { AttributeType } from '../../../../../commons/attribute-type';
import { SortOrder } from '../../../../../commons/enums/sort-order.enum';
import { ApplicationGraphQLDatasource } from '../../../../../datasources/apigraphql';
import { CommonListCtx } from '../../../../generic/list/ctrl';
import { ListDefinition } from '../../../../generic/list/types/ListDefinition';

export class ApplicationListStore extends CommonListCtx {
  defaultListDefs: ListDefinition = {
    id: 'applications_list',
    name: 'applications_list',
    filters: [
      { name: 'initials', title: 'Initials', type: AttributeType.Text },
      { name: 'name', title: 'Name', type: AttributeType.Text },
    ],
    columns: [
      { colname: 'initials', title: 'Initials', type: AttributeType.Text, show: true },
      { colname: 'name', title: 'Name', type: AttributeType.Text, show: true },
      { colname: 'description', title: 'Description', type: AttributeType.Text },
      { colname: 'region.name', title: 'Region', type: AttributeType.Text, show: true, sortable: false },
    ],
    sort: { colname: 'name', title: '', type: AttributeType.Text },
    sortOrder: SortOrder.Up,
  };

  constructor() {
    super(new ApplicationGraphQLDatasource(), false);
    
    makeObservable(this);
  }
}
