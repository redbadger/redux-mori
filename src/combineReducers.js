// @flow

import { get, hashMap, merge } from 'mori';

type Action = {
  type: string
};
type State = Map;
type Reducer = (state: State, action: Action) => State;
type Reducers = {
  [key: string]: Reducer
};

const combineReducers = (reducers: Reducers) : Reducer => {
  const reducerKeys = Object.keys(reducers);
  return (state: State, action: Action) : State => {
    return reducerKeys.reduce((acc: State, key: string): State => {
      const reducer = reducers[key];
      const currentDomainState: State = get(state, key, hashMap());
      const nextDomainState = reducer(currentDomainState, action);
      return merge(acc, hashMap(key, nextDomainState));
    }, state || hashMap(), reducers);
  };
};

export default combineReducers;
