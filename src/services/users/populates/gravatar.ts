import grvtr from 'gravatar';

import type { MicroService } from '@/lib/microservice';

export default function gravatar(this: MicroService, _ids: any, items: any) {
  return Promise.all(
    items.map((item: any) => ({
      ...item,
      imageUrl: grvtr.url(item.email, { s: '100', r: 'x', d: 'retro' }, true),
    }))
  );
}
