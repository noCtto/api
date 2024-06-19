
import type { MicroService } from '../lib/microservice'
import type { Context } from 'moleculer'


function pipeline(query:any, page: number, limit: number) {
  return [
    { $match: query },
    {
      $facet: {
        totalCount: [{ $count: 'count' }],
        rows: [
          { $skip: page * limit },
          { $limit: limit }
        ]
      }
    },
    {
      $project: {
        rows: 1,
        total: { $arrayElemAt: ["$totalCount.count", 0] },
        page: { $literal: page },
        limit: { $literal: limit }
      }
    }
  ]
}

export async function externalResource(this: MicroService, ctx:Context, collection:string, query:any, page: number, limit: number){
  console.log('getting external resource', collection, ctx.params)
  return this.adapter.db.collection(collection).aggregate(pipeline(query, page, limit)).toArray()
}