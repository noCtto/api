import path from 'path';
import fs from 'fs';
import { sha256 } from '@utils/func';

import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

const uploadDir = './public/';

export default async function handler(
  this: MicroService,
  ctx: Context & { params: any; meta: any }
): Promise<Object[]> {
  return new this.Promise((resolve: any, reject: any) => {
    const ext = ctx.meta.mimetype.split('/')[1] || 'jpg';

    const filename = sha256(`${ctx.meta.filename}${this.randomName()}`);
    const name = `${filename}.${ext}`;
    const filePath = path.join(uploadDir, name);
    const f = fs.createWriteStream(filePath);
    f.on('close', () => {
      // File written successfully
      this.logger.info(`Uploaded file stored in '${filePath}'`);
      resolve({ file: { path: filePath, name }, meta: ctx.meta });
    });

    ctx.params.on('error', (err: any) => {
      this.logger.info('File error received', err.message);
      reject(err);

      // Destroy the local file
      f.destroy(err);
    });

    f.on('error', () => {
      // Remove the errored file.
      fs.unlinkSync(filePath);
    });

    ctx.params.pipe(f);
  }).then((data: any) => {
    const { file } = data;
    const { name } = file;
    return ctx.call('posts.create', { ...ctx.meta.$multipart, image: name });
  });
}
