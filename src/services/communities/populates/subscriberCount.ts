// import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default async function subscriberCount(
  this: MicroService,
  _ids: any,
  items: any,
  _handler: any,
  _ctx: Context & { params: { community: string; populate: string } }
) {
  this.logger.info('communities.populates.subscriberCount')
  return Promise.all(
    items.map((item: any) => {
      
      item.subscribers = item.subscribers && Object.keys(item.subscribers).length || 0
      
    })
  );
}
