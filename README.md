# `redux-mori`

[![NPM version](http://img.shields.io/npm/v/redux-mori.svg?style=flat-square)](https://www.npmjs.org/package/redux-mori)

`redux-mori` is a drop-in replacement for Redux's [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html) and [`createStore`](http://redux.js.org/docs/api/createStore.html) that works with [`mori.js`](http://swannodette.github.io/mori) immutable data structures.

Any `preloadedState` for Redux's [`createStore`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md) should be a `mori` [`hashMap`](http://swannodette.github.io/mori/#hashMap).

## Usage

If you create a store with `preloadedState`, make sure it is an instance of [`hashMap`]((http://swannodette.github.io/mori/#hashMap)):

#### Create Store / Combine Reducers:
```js
import { toClj } from 'mori';
import { combineReducers, createStore } from 'redux-mori';
import fooReducer from './fooReducer';
import bazReducer from './bazReducer';

const preloadedState = toClj({foo: 'bar', baz: 'quux'});
const rootReducer = combineReducers({fooReducer, bazReducer});
const store = createStore(rootReducer, preloadedState);
```

#### Action:
```js
const ACTION_REQUEST = 'ACTION_REQUEST'
const actionRequest = () => hashMap('type', ACTION_REQUEST)
```

Please note you can still use original redux `createStore` and write actions as JS objects, even if you're using `mori` in your state.

## Logger
If you're using Redux Logger and would like to get readable logs of state and actions, you can use our `createLogger` wrapper. You can use it exactly in the same way as the original but it presets following values:

```js
{
  actionTransformer,
  collapsed: true,
  stateTransformer,
}
```

Example:

```js
import createLogger from 'redux-mori/dist/createLogger';
import { createStore } from 'redux-mori';
import { applyMiddleware } from 'redux';
const middlewares = [];
if (isDev) {
  const logger = createLogger({
    predicate: (getState, action) => !/EFFECT_/.test(action.type),
  });
  middlewares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));
```

Actions get transformed fully into JS if they are `mori` objects. If they are JS objects with only some values as `mori` structures, it will transform this data into JS as well.
