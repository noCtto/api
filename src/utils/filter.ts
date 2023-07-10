import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// eslint-disable-next-line no-prototype-builtins
export const hasProperty = (source: any, property: any) =>
  source.hasOwnProperty(property);

export const checkProperty = (source: any, prop: any) => {
  const properties = prop.split('.');
  let nested = source;
  let has = false;

  properties.forEach((property: any) => {
    if (hasProperty(nested, property)) {
      nested = nested[property];
      has = true;
    } else {
      has = false;
    }
  });

  return [has, nested];
};
