import { ServiceBroker } from "moleculer";
import Service from '../@/services/posts/posts.service';

const single = {
  "_id": "64801f5335359f3f75f73327",
  "title": "Test Post --1020",
  "body": "this is a test",
  "image": "https://img",
  "createdAt": "2023-06-07T06:10:27.104Z",
  "tags": null,
  "tid": "64801f5335359f3f75f73328",
  "vid": "64801f5335359f3f75f73329",
  "bid": "63c79944ea965a14c03df9e2",
  "uid": "5fac21fc48c354c3f2949cc0"
};

describe("Post' Tests", () => {
    let broker = new ServiceBroker({ logger: false });
    let service = broker.createService(Service);

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    describe("Test 'health' action", () => {
        it("should return health message", async () => {
            const res = await service.actions.health();
            expect(res).toBe("I am alive!");
        });
    });

    describe("Test 'list' action", () => {

        it("should return all posts", async () => {
            const res = await service.actions.list();
            console.log("Test List Result =>>>>",res);
            // expexts to be a object with keys
            expect(res).toHaveProperty('rows');
        });
    });

    describe("Test 'get' action", () => {
        it("should return a post", async () => {

            const res = await broker.call("posts.get", { id: "64802233dcc96447fdb5a81a" }).catch((err) => {
                console.log("ERROR =>>>", err);
            });
            console.log("Test Result =>>>>",res);

            // expexts to be a object with keys
            expect(res).toHaveProperty('_id');
        });
    });
});