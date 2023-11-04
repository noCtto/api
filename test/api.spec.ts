
import request from 'supertest'
import { ServiceBroker } from 'moleculer';
import Service from '../src/services/posts/posts.service';
import UsersService from '../src/services/users/users.service';
import CommunitiesService from '../src/services/communities/communities.service';
import VotesService from '../src/services/votes/votes.service';
import ThreadsService from '../src/services/threads/threads.service';
import CommentsService from '../src/services/comments/comments.service';
import SessionsService from '../src/services/sessions/sessions.service';
import ApiService from '../src/services/api/api.service';

import { faker } from '@faker-js/faker';

const ServiceName = 'api.gateway';

describe(`${ServiceName}' Tests - Suite`, () => {
  
  let broker = new ServiceBroker({ logger: false });

  let apiService = broker.createService(ApiService)
  let _postsService = broker.createService({ name: 'posts', ...Service });
  let _usersService = broker.createService({ name: 'users', ...UsersService });
  let _sessionsService = broker.createService({ name: 'sessions', ...SessionsService });
  let _comunitiesService = broker.createService({ name: 'communities', ...CommunitiesService });
  let _votesService = broker.createService({ name: 'votes', ...VotesService });
  let _threadsService = broker.createService({ name: 'threads', ...ThreadsService });
  let _commentsService = broker.createService({ name: 'comments', ...CommentsService });
  
  console.log('_apiService', apiService != null)
  console.log('_commentsService', _commentsService != null)
  console.log('_comunitiesService', _comunitiesService != null)
  console.log('_postsService', _postsService != null)
  console.log('_sessionsService', _sessionsService != null)
  console.log('_threadsService', _threadsService != null)
  console.log('_usersService', _usersService != null)
  console.log('_votesService', _votesService != null)
  
  beforeAll(() => broker.start());
  afterAll(() => broker.stop());
  
  it("test '/status'", () => {
    return request(apiService.server)
        .get("/status")
        .then((res:any) => {
            expect(res.body).toEqual({});
        });
  });

  it("test '/unknown-route'", () => {
    return request(apiService.server)
        .get("/api/unknown-route")
        .then((res:any) => {
            expect(res.statusCode).toBe(404);
        });
  });

let fakeUser = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: "123456789"
  }
  it("test '/register'", () => {
    return request(apiService.server)
        .post("/register")
        .send(fakeUser)
        .then((res:any) => {
          console.log('register request response', res.body)
          expect(res.statusCode).toBe(200);
        });
  });
  it("test '/login'", () => {
    return request(apiService.server)
        .post("/login")
        .send(fakeUser)
        .then((res:any) => {
          console.log('login request response', res.body)
          expect(res.statusCode).toBe(200);
        });
  });
  
  it("test '/all'", () => {
    return request(apiService.server)
        .get("/all")
        .then((res:any) => {
          console.log('all posts response', res.body)
          expect(res.statusCode).toBe(200);
        });
  });
  
  it("test '/logout'", () => {
    return request(apiService.server)
        .post("/login")
        .send({ email: fakeUser })
        .then((res:any) => {
          console.log('logout request response', res.body)
          expect(res.statusCode).toBe(200);
        });
  });
  
});
