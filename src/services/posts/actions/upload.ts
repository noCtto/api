import mime from 'mime';
import path from 'path';
import fs from 'fs';
import { sha256 } from '../../../utils/func';

import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

const uploadDir = './public/';

export default async function handler(this:PostThis, ctx: Context & { params: any, meta: any }): Promise<string[]> {
  return new this.Promise((resolve, reject) => {
    const ext = mime.getExtension(ctx.meta.mimetype);
    const filename = sha256(`${ctx.meta.filename}${this.randomName()}`);
    const name = `${filename}.${ext}`;
    const filePath = path.join(uploadDir, name);
    const f = fs.createWriteStream(filePath);
    f.on('close', () => {
      // File written successfully
      this.logger.info(`Uploaded file stored in '${filePath}'`);
      resolve({ file: { path: filePath, name }, meta: ctx.meta });
    });

    ctx.params.on('error', (err:any) => {
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
  }).then((data:any) => {
    const { file } = data;
    const { name } = file;
    // const arr = [];
    // for (let i = 0; i < 100; i++) {
    //     arr.push(
    //         ctx.call("posts.create", { ...ctx.meta.$multipart, image: name })
    //     );
    // }
    // return Promise.all(arr);
    return ctx.call('posts.create', { ...ctx.meta.$multipart, image: name });
  });
};