
import faker from 'faker';

export default function randomId(m, u) {
  const r = faker.datatype.number({ min: 0, max: m });
  try {
    return u[r] !== undefined ? u[r] : this.randomId(m, u);
  } catch (err) {
    return this.randomId(m, u);
  }
};
