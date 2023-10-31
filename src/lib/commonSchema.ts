import { OBJECTID_REGEX } from '@lib/constants';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const ZodObjectId = z
  .union([z.instanceof(ObjectId), z.string().regex(OBJECTID_REGEX)])
  .transform((value) =>
    value instanceof ObjectId ? value : new ObjectId(value)
  );
