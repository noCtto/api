/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const getValueForRegExp = (value, operator) => {
  switch (operator) {
    case 'contains':
      return `.*${value}.*`;
    case 'startsWith':
      return `^${value}`;
    case 'endsWith':
      return `${value}$`;
    case 'not':
      return { operator: 'ne', value };
    case 'after':
      return { operator: 'gt', value };
    case 'onOrAfter':
      return { operator: 'gte', value };
    case 'before':
      return { operator: 'lt', value };
    case 'onOrBefore':
      return { operator: 'lte', value };
    case 'is':
    default:
      return { operator: 'is', value };
  }
};

// eslint-disable-next-line no-prototype-builtins
const hasProperty = (source, property) => source.hasOwnProperty(property);

const checkProperty = (source, prop) => {
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

const compareDates = ({ clientDate, serverDate, operator }) => {
  switch (operator) {
    case 'ne':
      return clientDate.$d !== serverDate.$d;
    case 'lt':
      return clientDate.isAfter(serverDate);
    case 'lte':
      return clientDate.isSameOrAfter(serverDate);
    case 'gt':
      return clientDate.isBefore(serverDate);
    case 'gte':
      return clientDate.isSameOrBefore(serverDate);
    case 'is':
      return clientDate.$d === serverDate.$d;
    default:
      return false;
  }
};

exports.list = (ctx, res) => {
  if (ctx.params.filter) {
    const searchItems = Object.assign(
      {},
      ...JSON.parse(ctx.params.filter).map((item) => ({
        [item.c]: item.isDate
          ? getValueForRegExp(item.v, item.o)
          : new RegExp(getValueForRegExp(item.v, item.o), 'i'),
      }))
    );

    const rows = res.rows.filter((item) => {
      const keys = Object.keys(searchItems);
      let stay = false;
      for (const index in keys) {
        const key = keys[index];
        const [exist, value] = checkProperty(item, key);
        try {
          stay = exist && searchItems[key].test(value);
        } catch (error) {
          const { operator, value: clientValue } = searchItems[key];

          stay = compareDates({
            clientDate: dayjs(clientValue),
            serverDate: dayjs(item[key]),
            operator,
          });
        }
      }
      return stay;
    });
    return {
      ...res,
      rows,
      total: rows.length,
    };
  }
  return res;
};
