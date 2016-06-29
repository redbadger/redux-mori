// @flow
import { hashMap, toJs } from 'mori';
import { stateTransformer, actionTransformer } from '../src/createLogger';

describe('create redux logger', () => {
  context('state transformation', () => {
    it('transforms state into js', () => {
      const initial = hashMap(
        'user', hashMap(
          'id', '123',
          'name', 'Kadi'
        ),
        'profile', hashMap(
          'address', hashMap(
            'country', hashMap(
              'code', 'ET',
              'name', 'Estonia'
            )
          )
        )
      );
      const expected = toJs(initial);
      const actual = stateTransformer(initial);
      expect(actual).to.deep.equal(expected);
    });
  });

  context('action transformation', () => {
    it('transforms action values to JS if they are a mori collection', () => {
      const initial = {
        type: 'LOGIN_SUCCESS',
        user: hashMap(
          'id', '345',
          'name', 'Marcel',
          'language', hashMap(
            'code', 'en',
            'name', 'English'
          )
        ),
      };
      const expected = {
        type: 'LOGIN_SUCCESS',
        user: toJs(initial.user),
      };
      const actual = actionTransformer(initial);
      expect(actual).to.deep.equal(expected);
    });

    it('transforms actions into JS if they are a mori collection', () => {
      const initial = hashMap(
        'type', 'LOGIN_SUCCESS',
        'user', hashMap(
          'id', '345',
          'name', 'Marcel',
          'language', hashMap(
            'code', 'en',
            'name', 'English'
          )
        ),
      );
      const expected = toJs(initial);
      const actual = actionTransformer(initial);
      expect(actual).to.deep.equal(expected);
    });
  });
});
