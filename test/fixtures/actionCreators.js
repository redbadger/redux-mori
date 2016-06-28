import { hashMap } from 'mori';
import { ADD_TODO, UKNOWN_ACTION } from './actionTypes';

export const addTodo = (text) =>
  hashMap('type', ADD_TODO, 'text', text);

export const unknownAction = () =>
  hashMap('type', UKNOWN_ACTION);

