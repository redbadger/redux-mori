import { into, reduceKV, inc, hashMap, get, vector } from 'mori';
import { ADD_TODO } from './actionTypes';

const id = (state = vector()) => reduceKV(inc, 1, state);

export function todos (state = vector(), action) {
  switch (get(action, 'type')) {
    case ADD_TODO:
      return into(state, vector(hashMap(
        'id', id(state),
        'text', get(action, 'text')
      )));
    default:
      return state;
  }
}

export function todosReverse (state = [], action) {
  switch (get(action, 'type')) {
    case ADD_TODO:
      return into(vector(hashMap(
        'id', id(state),
        'text', get(action, 'text')
      )), state);
    default:
      return state;
  }
}
