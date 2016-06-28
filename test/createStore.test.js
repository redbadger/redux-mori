import { equals, hashMap, vector } from 'mori';
import createStore from '../src/createStore';
import combineReducers from '../src/combineReducers';
import * as reducers from './fixtures/reducers';
import { addTodo, unknownAction } from './fixtures/actionCreators';

describe('createStore()', () => {
  context('initialized', () => {
    it('exposes the public API', () => {
      const rootReducer = combineReducers(reducers);
      const store = createStore(rootReducer);

      expect(store).to.have.all.keys(
        'subscribe',
        'dispatch',
        'getState',
        'replaceReducer'
      );
    });
  });

  context('reducer argument', () => {
    it('throws when none', () => {
      expect(() =>
        createStore()
      ).to.throw();
    });

    it('throws when string', () => {
      expect(() =>
        createStore('')
      ).to.throw();
    });

    it('throws when map', () => {
      expect(() =>
        createStore(hashMap())
      ).to.throw();
    });

    it('throws when vector', () => {
      expect(() =>
        createStore(vector())
      ).to.throw();
    });

    it('does not throw when function', () => {
      expect(() =>
        createStore(() => hashMap())
      ).to.not.throw();
    });
  });

  context('initial state and action arguments', () => {
    it('should return correct vector', () => {
      const store = createStore(reducers.todos, vector(
        hashMap('id', 1, 'text', 'foo')
      ));
      const expected = vector(
        hashMap('id', 1, 'text', 'foo')
      );

      expect(equals(store.getState(), expected)).to.be.true;
    });
  });

  context('applying reducer to initial action', () => {
    it('should return correct initial state', () => {
      const store = createStore(reducers.todos, vector(
        hashMap('id', 1, 'text', 'Hello')
      ));
      const expected = vector(
        hashMap('id', 1, 'text', 'Hello')
      );

      expect(equals(store.getState(), expected)).to.be.true;
    });
  });

  context('applying reducers to previous state', () => {
    it('should return correct state', () => {
      const store = createStore(reducers.todos);

      expect(equals(store.getState(), vector())).to.be.true;
      store.dispatch(unknownAction());

      expect(equals(store.getState(), vector())).to.be.true;
      store.dispatch(addTodo('Hello'));

      expect(equals(store.getState(), vector(hashMap(
        'id', 1,
        'text', 'Hello'
      )))).to.be.true;
      store.dispatch(addTodo('World'));

      expect(equals(store.getState(), vector(
        hashMap(
          'id', 1,
          'text', 'Hello'
        ),
        hashMap(
          'id', 2,
          'text', 'World'
        )))).to.be.true;
    });
  });

  context('replacing a reducer', () => {
    it('should preserve state', () => {
      const store = createStore(reducers.todos);
      store.dispatch(addTodo('Hello'));
      store.dispatch(addTodo('World'));

      store.replaceReducer(reducers.todosReverse);

      expect(equals(store.getState(), vector(
        hashMap('id', 1, 'text', 'Hello'),
        hashMap('id', 2, 'text', 'World')
      ))).to.be.true;

      store.dispatch(addTodo('Top'));

      expect(equals(store.getState(), vector(
        hashMap('id', 3, 'text', 'Top'),
        hashMap('id', 1, 'text', 'Hello'),
        hashMap('id', 2, 'text', 'World')
      ))).to.be.true;

      store.replaceReducer(reducers.todos);

      store.dispatch(addTodo('Bottom'));

      expect(equals(store.getState(), vector(
        hashMap('id', 3, 'text', 'Top'),
        hashMap('id', 1, 'text', 'Hello'),
        hashMap('id', 2, 'text', 'World'),
        hashMap('id', 4, 'text', 'Bottom')
      ))).to.be.true;
    });
  });

  context('single subscription', () => {
    let store;

    beforeEach(() => {
      const rootReducer = combineReducers(reducers);
      store = createStore(rootReducer);
    });

    it('should call listener correctly', () => {
      const listenerA = sinon.spy(() => {});

      store.subscribe(listenerA);
      store.dispatch(unknownAction());

      expect(listenerA).to.have.been.calledOnce;
    });

    it('should unsubscribe single listener correctly', () => {
      const listenerA = sinon.spy(() => {});
      const unsubscribeA = store.subscribe(listenerA);

      store.dispatch(unknownAction());

      expect(listenerA).to.have.been.calledOnce;
      unsubscribeA();

      store.dispatch(unknownAction());
      expect(listenerA).to.have.been.calledOnce;
    });
  });
});
