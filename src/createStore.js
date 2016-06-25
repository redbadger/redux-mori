// @flow
import { isMap, get, hashMap } from 'mori';
import type { State, Action, Reducer, StoreEnhancer } from './types';

export const ActionTypes = hashMap('INIT', '@@redux/INIT');

export default function createStore (reducer: Reducer, preloadedState: ?State, enhancer: ?StoreEnhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  const ensureCanMutateNextListeners = () => {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  };

  const getState = (): ?State => currentState;

  const subscribe = (listener: Function) => {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return () => {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  };

  function dispatch (action: Action) {
    if (!isMap(action)) {
      throw new Error(
        'Actions must be maps. ' +
        'Use custom middleware for async actions.'
      );
    }

    if (typeof get(action, 'type') === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      );
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  function replaceReducer (nextReducer: Reducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch(hashMap('type', get(ActionTypes, 'INIT')));
  }

  dispatch(hashMap('type', get(ActionTypes, 'INIT')));

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
  };
}
