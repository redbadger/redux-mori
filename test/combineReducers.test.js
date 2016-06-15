// @flow
import { toClj, getIn, updateIn, inc } from 'mori';
import combineReducers from '../src/combineReducers';

describe('combineReducers()', () => {
  context('reducer returns received state', () => {
    it('returns initial state', () => {
      const rootReducer = combineReducers({
        foo: (state) => {
          return state;
        },
      });

      const initialState = toClj({
        foo: {
          count: 1,
        },
      });

      const actual = rootReducer(initialState, {type: 'NONE'});
      expect(actual.toString()).to.equal(initialState.toString());
    });
  });

  context('reducer creates new domain state', () => {
    it('returns new state', () => {
      const rootReducer = combineReducers({
        foo: (state) => {
          return updateIn(state, ['count'], inc);
        },
      });

      const initialState = toClj({
        foo: {
          count: 0,
        },
      });

      const actual = rootReducer(initialState, {type: 'ADD'});
      expect(getIn(actual, ['foo', 'count'])).to.equal(1);
    });
  });

  context('root reducer is created from nested combineReducers', () => {
    it('returns initial state from default values', () => {
      const initialState = toClj({
        outer: {
          inner: {
            bar: false,
            foo: true,
          },
        },
      });

      const innerDefaultState = toClj({
        bar: false,
        foo: true,
      });

      const rootReducer = combineReducers({
        outer: combineReducers({
          inner: (state = innerDefaultState) => {
            return state;
          },
        }),
      });

      expect(rootReducer().toString()).to.eql(initialState.toString());
    });
  });
});
