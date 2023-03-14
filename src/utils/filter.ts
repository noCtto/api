import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// eslint-disable-next-line no-prototype-builtins
export const hasProperty = (source, property) => source.hasOwnProperty(property);

export const checkProperty = (source, prop) => {
  const properties = prop.split('.');
  let nested = source;
  let has = false;

  properties.forEach((property) => {
    if (hasProperty(nested, property)) {
      nested = nested[property];
      has = true;
    } else {
      has = false;
    }
  });

  return [has, nested];
};
