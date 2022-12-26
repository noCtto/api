const mime = require('mime');
const path = require('path');
const fs = require('fs');
const { sha256 } = require('../../../utils/func');

const uploadDir = './public/';
module.exports = async function handler(ctx) {
  return new this.Promise((resolve, reject) => {
    const ext = mime.extension(ctx.meta.mimetype);
    const filename = sha256(`${ctx.meta.filename}${this.randomName()}`);
    const name = `${filename}.${ext}`;
    const filePath = path.join(uploadDir, name);
    const f = fs.createWriteStream(filePath);
    f.on('close', () => {
      // File written successfully
      this.logger.info(`Uploaded file stored in '${filePath}'`);
      resolve({ file: { path: filePath, name }, meta: ctx.meta });
    });

    ctx.params.on('error', (err) => {
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
  }).then(({ file }) => {
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
