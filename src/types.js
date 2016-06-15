// @flow
export type State = {[key: string]: any};
export type Action = { type: string };
export type Reducer = (state: ?State, action: Action) => State;
export type Reducers = { [key: string]: Reducer };
