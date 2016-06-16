# `redux-mori`

[![NPM version](http://img.shields.io/npm/v/redux-mori.svg?style=flat-square)](https://www.npmjs.org/package/redux-mori)

`redux-mori` is a drop-in replacement for Redux's [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html) that works with [`mori.js`](http://swannodette.github.io/mori) immutable data structures.

Any `preloadedState` for Redux's [`createStore`](https://github.com/reactjs/redux/blob/master/docs/api/createStore.md) should be a `mori` [`hashMap`](http://swannodette.github.io/mori/#hashMap).

## Usage

Create a store with `preloadedState` set to an instance of [`hashMap`]((http://swannodette.github.io/mori/#hashMap)):

```js
import { toClj } from 'mori';
import { combineReducers } from 'redux-mori';
import { createStore } from 'redux';
import fooReducer from './fooReducer';
import bazReducer from './bazReducer';

const preloadedState = toClj({foo: 'bar', baz: 'quux'});
const rootReducer = combineReducers({fooReducer, bazReducer});
const store = createStore(rootReducer, preloadedState);
```
