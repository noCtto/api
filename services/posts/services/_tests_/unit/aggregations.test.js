const stock = require("../../../aggregations/stock.aggretation");
const counts = require("../../../aggregations/counts.aggregation");

const COMPANY = "6070d17b1f9a6a0c154a1b0b";
const TEST_SKU_NUMBER = "BA-A2R-U-NA";

describe("Test 'Stock' Aggregations", () => {
    it("stockAggregation", () => {
        const result = stock.stockAggregation(COMPANY);
        expect(result).toBeTruthy();
    });

    it("stockAggregationByItem", () => {
        const result = stock.stockAggregationByItem(COMPANY, TEST_SKU_NUMBER);
        expect(result).toBeTruthy();
    });

    it("quantitiesAggregation", () => {
        const result = stock.quantitiesAggregation();
        expect(result).toBeTruthy();
    });

    it("quantitiesAggregation", () => {
        const result = stock.countStatus(COMPANY);
        expect(result).toBeTruthy();
    });
});

describe("Test 'Counts' Aggregations", () => {
    it("countsSeeker", () => {
        const result = counts.countsSeeker(COMPANY);
        expect(result).toBeTruthy();
    });
});
