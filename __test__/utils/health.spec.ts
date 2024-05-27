import health from '../../src/utils/health'
describe('test utils health', () => {
  it ('should return health', async () => {
    const res = health();
    expect(res).toBe('I am alive!')
  })
})