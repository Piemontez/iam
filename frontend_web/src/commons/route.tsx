import { IconName } from '@fortawesome/fontawesome-svg-core';
import { createBrowserHistory } from 'history';
import qs from 'qs';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { EndpointsDef } from '../datasources/endpoints';
import { RoutesName } from '../views/routes-name';
import { localStorageDef } from './consts';
import Storage from './storage';

export const history = createBrowserHistory();

export type RouteDefinition = { title: string; icon?: IconName | Array<IconName>; path: string; component: any };
export type RouteDefinitions = { [key: string]: RouteDefinition };

export function getHistory() {
  return history;
}

export function historyPush(
  owner: RoutesName | string,
  options: { id?: any; inModal?: boolean; showSave?: boolean; open?: boolean; absolute?: boolean; search?: boolean } & any = {},
) {
  let push;
  switch (owner as RoutesName) {
    case 'home':
      push = '/mgt/home';
      break;
    //PUBLIC
    case 'login':
      push = '/public/:region/:app/login'.replace(':region', options.region).replace(':app', options.app);
      break;
    //MGT
    case 'permissions_list':
    case 'permissions_edit':
    case 'permissions_new':
    case 'tokens_active':
    case 'login_history':
      push = '/mgt/home';
      break;
    case 'person_list':
      push = '/mgt/person/list';
      break;
    case 'person_edit':
      push = '/mgt/person/edit/:id'.replace(':id', options.id);
      break;
    case 'person_new':
      push = '/mgt/person/new';
      break;
    case 'role_list':
      push = '/mgt/role/list';
      break;
    case 'role_edit':
      push = '/mgt/role/edit/:id'.replace(':id', options.id);
      break;
    case 'role_new':
      push = '/mgt/role/new';
      break;
    default:
      push = owner;
      break;
  }
  if (options?.open) {
    if (options.absolute) {
      window.open(push);
    } else {
      window.open(`${EndpointsDef.url}:${EndpointsDef.port}${push}`);
    }
  } else if (options?.inModal) {
    const search = history.location.search + qs.stringify(options.search);
    let newLocation = history.location.pathname + push.replace(/\/mgt/, '/modal') + '?' + search;
    if (options?.showSave) {
      newLocation = newLocation + '&show_save=show_save';
    }
    history.push(newLocation);
  } else {
    history.push(push);
  }
}

/**
 * Altera os filtros informados na URL.
 * Altera tudo que tem depois do ? na URL.
 * @param params
 * @param exclude
 */
export function historySearchReplace(params: any, exclude: string[] = []) {
  params = Object.assign({}, params, { page: undefined, count: undefined });

  exclude.forEach((x) => (params[x] = undefined));

  history.replace({
    search: '?' + qs.stringify(params),
  });
}

/**
 * Retorna os filtros informados na url
 */
export function historySearch(options: { parseArrays?: boolean } = {}) {
  return qs.parse(history.location.search.slice(1), options);
}

/**
 * Dispara uma função quando o usuário clica em historyback
 */
const hPopsCallbacks: any[] = [];
export function historyOnPop(listener: any) {
  hPopsCallbacks.push(listener);
}

/**
 * Verifica se esta autenticado e libera a rota
 * @param param0
 */
export const PrivateRoutes = ({ redirect, children }: { redirect?: string; children: any }): JSX.Element => {
  return Storage.getItem(localStorageDef.tokenKey) ? children : redirect ? <Redirect to={redirect} /> : null;
};

/**
 * Escuta as alterações de links realizadas no sistema.
 */
history.listen((location, action) => {
  //Verifica se tem uma hash/acontora de página e move a página até o elemento.
  if (location.hash) {
    const id = location.hash.replace('#', '');
    const element = document.getElementById(id);
    if (element) element.scrollIntoView();
  }

  //Dispara as ações ligadas ao history back;
  if (action === 'POP') {
    for (const callback of hPopsCallbacks) {
      if (typeof callback === 'function') {
        callback(location, action);
      }
    }
  }
  hPopsCallbacks.splice(0, hPopsCallbacks.length);
});
