import {
  isPlainObject, flatMap, map, concat, keys,
} from 'lodash';

export const getPaths = (obj, parentKey) => {
  let result;
  if (isPlainObject(obj)) {
    result = flatMap(keys(obj), (key) => map(getPaths(obj[key], key), (subkey) => (parentKey ? `${parentKey}.` : '') + subkey));
  } else {
    result = [];
  }
  return concat(result, parentKey || []);
};
