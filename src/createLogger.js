// @flow

import reduxLogger from 'redux-logger';
import { toJs, isCollection } from 'mori';

export const stateTransformer = (state: Object): Object => toJs(state);
export const actionTransformer = (action: Object): Object => {
  if (isCollection(action)) {
    return toJs(action);
  }

  return Object.keys(action)
    .reduce((acc, name) => ({
      ...acc,
      [name]: isCollection(action[name]) ? toJs(action[name]) : action[name],
    }), {});
};

const getDefaultOptions = (): Object => ({
  actionTransformer,
  collapsed: true,
  stateTransformer,
});

const createLogger = (options: Object, logger: Function = reduxLogger): Object => logger({ // eslint-disable-line space-infix-ops
  ...getDefaultOptions(),
  ...options,
});

export default createLogger;
