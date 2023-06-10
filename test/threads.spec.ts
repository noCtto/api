import { ServiceBroker } from "moleculer";
import Service from '../@/services/threads/threads.service';

describe("Test 'health' actions", () => {
    let broker = new ServiceBroker({ logger: false });
    let service = broker.createService(Service);
    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    describe("Test 'health' action", () => {
        it("should return health message", async () => {
            const res = await service.actions.health();
            console.log("Test Res =>>>>",res);
            // Check the result
            expect(res).toBe("I am alive!");
        });
    });
});