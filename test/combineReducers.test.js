// @flow
import { toClj, hashMap, getIn, updateIn, inc } from 'mori';
import combineReducers from '../src/combineReducers';
import type { State } from '../src/types';

describe('combineReducers()', () => {
  context('reducer returns received state', () => {
    it('returns initial state', () => {
      const rootReducer = combineReducers({
        foo: (state: ?State) => {
          return state || hashMap();
        },
      });

      const initialState = toClj({
        foo: {
          count: 1,
        },
      });

      const actual = rootReducer(initialState, hashMap('type', 'NONE'));
      expect(actual.toString()).to.equal(initialState.toString());
    });
  });

  context('reducer creates new domain state', () => {
    it('returns new state', () => {
      const rootReducer = combineReducers({
        foo: (state: ?State) => {
          return updateIn(state, ['count'], inc);
        },
      });

      const initialState = toClj({
        foo: {
          count: 0,
        },
      });

      const actual = rootReducer(initialState, hashMap('type', 'ADD'));
      expect(getIn(actual, ['foo', 'count'])).to.equal(1);
    });
  });

  context('root reducer is created from nested combineReducers', () => {
    it('returns initial state from default values', () => {
      const initialState: State = toClj({
        outer: {
          inner: {
            bar: false,
            foo: true,
          },
        },
      });

      const innerDefaultState: State = toClj({
        bar: false,
        foo: true,
      });

      const rootReducer = combineReducers({
        outer: combineReducers({
          inner: (state : ? State = innerDefaultState) => {
            return state || hashMap();
          },
        }),
      });

      expect(rootReducer(undefined, hashMap('type', 'WHATEVS')).toString()).to.eql(initialState.toString());
    });
  });
});
