import { ObjectId } from 'mongodb';

export default function extractUser(ctx: any): ObjectId | null {
  const { meta, params } = ctx;

  if (meta?.user?.user?.userId) {
    return new ObjectId(meta.user.user.userId);
  }

  if (meta?.oauth?.user?.id) {
    return new ObjectId(meta.oauth.user.id);
  }

  if (params?.uid) {
    return new ObjectId(params.uid);
  }

  return null;
}
