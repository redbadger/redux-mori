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
