// @flow
export type State = {[key: string]: any};
export type Action = () => any;
export type Dispatch = (action: Action) => Action;
export type Reducer = (state: ?State, action: Action) => State;
export type Reducers = { [key: string]: Reducer };
export type StoreCreator = (reducer: Reducer, preloadedState: ?State) => Store;
export type StoreEnhancer = (next: StoreCreator) => StoreCreator;
export type Store = {
  dispatch: Dispatch,
  getState: () => ?State,
  subscribe: (listener: () => void) => () => void,
  replaceReducer: (reducer: Reducer) => void,
};
