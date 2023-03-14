
export default async function count(ids, items) {
  return items.map((item) => {
    const keys = Object.keys(item.voters);
    const { length } = keys;
    item.count = keys.map((key) => item.voters[key]).reduce((a, b) => a + b, 0);
    item.total = length;
    return item;
  });
};
