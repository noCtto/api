const { ServiceBroker } = require("moleculer");
const { MoleculerClientError, ValidationError } = require("moleculer").Errors;

// Load service schema
const ServiceSchema = require("../../index.service");

const COMPANY = "6070d17b1f9a6a0c154a1b0b";
const TEST_SKU_NUMBER = "BA-A2R-U-NA";

expect.extend({
    toContainObject(received, argument) {
        const pass = this.equals(
            received,
            expect.arrayContaining([expect.objectContaining(argument)])
        );

        if (pass) {
            return {
                message: () =>
                    `expected ${this.utils.printReceived(
                        received
                    )} not to contain object ${this.utils.printExpected(argument)}`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected ${this.utils.printReceived(
                        received
                    )} to contain object ${this.utils.printExpected(argument)}`,
                pass: false,
            };
        }
    },
});

describe("Test 'Items", () => {
    // Create a service broker
    let broker = new ServiceBroker({ logger: false });
    // // Create the actual service
    let service = broker.createService(ServiceSchema);

    // // Start the broker. It will also init the service
    beforeAll(() => broker.start());
    // // Gracefully stop the broker after all tests
    afterAll(() => broker.stop());

    describe("Test 'items.service' heartBeat", () => {
        it("should return alive signal", async () => {
            const alive = await broker.call("items.heartBeat");
            expect(alive).toBe(`I'm alive`);
        });
    });

    describe("Test 'items.exists' action", () => {
        // No parameters validation
        it("should return parameter validation error | no parameters", async () => {
            try {
                const result = await broker.call("items.exists");
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
        // Parameters with empty strings
        it("should return parameter validation error | empty strings", async () => {
            try {
                const result = await broker.call("items.exists", { number: "", company: "" });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
        // Only One Parameter
        it("should return parameter validation error | one parameter missing", async () => {
            try {
                const result = await broker.call("items.exists", { number: "1234", company: "" });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
        // Entity not found
        it("should return parameter validation error | entity not found", async () => {
            try {
                const result = await broker.call("items.exists", {
                    number: "1234",
                    company: "1234",
                });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
        // Entity Found
        it("should return exists true| entity found", async () => {
            const result = await broker.call("items.exists", {
                number: TEST_SKU_NUMBER,
                company: COMPANY,
            });
            expect(result).toHaveProperty("_id");
            expect(result).toHaveProperty("number");
            expect(result).toHaveProperty("htsCode");
            expect(result).toHaveProperty("upcCode");
        });
    });

    describe("Test 'items.lines' action", () => {
        // No parameters
        it("should return parameter validation error | no parameters", async () => {
            try {
                const result = await broker.call("items.lines");
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
        // Wrong parameters
        it("should return parameter validation error | wrong parameters", async () => {
            try {
                const result = await broker.call("items.lines", { lines: "", company: "" });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });

        // Empty parameter array
        it("should return parameter validation error | wrong parameters", async () => {
            try {
                const result = await broker.call("items.lines", { lines: [], company: COMPANY });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });

        // Item Array with wrong company
        it("should return parameter validation error | Array with wrong company", async () => {
            try {
                const result = await broker.call("items.lines", {
                    lines: [{ number: "BA-A2R-U-NA" }],
                    company: COMPANY,
                });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
    });

    describe("Test 'items.import' action", () => {
        // No parameters
        it("should return parameter validation error | no parameters", async () => {
            try {
                const result = await broker.call("items.import");
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
        // Wrong parameters
        it("should return parameter validation error | wrong parameters", async () => {
            try {
                const result = await broker.call("items.import", { data: "" });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });

        // Empty parameter array
        it("should return parameter validation error | wrong parameters", async () => {
            try {
                const result = await broker.call("items.import", { data: [] });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });

        // Item Array with wrong company
        it("should return parameter validation error | Array with wrong company", async () => {
            try {
                const result = await broker.call("items.import", {
                    data: [{ number: "JEST-TEST-001" }],
                });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
    });

    describe("Test 'items.search' action", () => {
        // No parameters
        it("should return parameter validation error | no parameters", async () => {
            try {
                const result = await broker.call("items.search");
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });
        // Wrong parameters
        it("should return parameter validation error | empty parameters", async () => {
            try {
                const result = await broker.call("items.search", { value: "" });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });

        // Empty parameter array
        it("should return parameter validation error | wrong parameters", async () => {
            try {
                const result = await broker.call("items.search", { value: [] });
            } catch (err) {
                expect(err).toBeInstanceOf(MoleculerClientError);
            }
        });

        // Item Array with wrong company
        it("should return parameter validation error | Array with wrong company", async () => {
            const result = await broker.call("items.search", {
                value: TEST_SKU_NUMBER,
                company: COMPANY,
            });
            expect(result).toContainObject({ number: TEST_SKU_NUMBER });
        });
    });
});
