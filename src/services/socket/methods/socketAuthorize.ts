import { SocketThis } from '../socket.service';

export default function socketAuthorize(this: SocketThis, socket: any) {
  console.log('Login using token:', socket.handshake.query.token);
  const accessToken = socket.handshake.query.token;
  if (accessToken) {
    if (
      accessToken ===
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTIwMjBiM2YyMzQ5YjU0NTAwZmViYyIsImV4cCI6MTY2MzMwNjIwODAwMCwiaWF0IjoxNjYzMzA2MjA4fQ.t9iE6tUesphmgDGZjKU3YAmCHZS86_w6PR0c4eFTMm0'
    ) {
      // valid credential
      return Promise.resolve({
        id: 1,
        detail: 'You are authorized using token.',
        name: 'John Doe',
      });
    }
    // invalid credentials
    return Promise.reject();
  }
  // anonymous user
  return Promise.resolve();
}
