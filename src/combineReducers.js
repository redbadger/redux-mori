// @flow
import { get, hashMap, merge } from 'mori';
import type { State, Action, Reducer, Reducers } from './types';

function combineReducers (reducers: Reducers) : Reducer {
  const reducerKeys = Object.keys(reducers);
  return function (state: ?State, action: Action) : State {
    return reducerKeys.reduce((acc: State, key: string): State => {
      const reducer = reducers[key];
      const currentDomainState: ?State = get(state, key, undefined);
      const nextDomainState: State = reducer(currentDomainState, action);
      return merge(acc, hashMap(key, nextDomainState));
    }, state || hashMap(), reducers);
  };
};

export default combineReducers;
