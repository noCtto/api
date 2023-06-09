
import grvtr from 'gravatar';

import type { AccountThis } from '../accounts.service';

export default function gravatar(this:AccountThis, _ids:any, items:any) {
  return Promise.all(
    items.map((item:any) => ({
      ...item,
      imageUrl: grvtr.url(item.email, { s: '100', r: 'x', d: 'retro' }, true),
    }))
  );
};
