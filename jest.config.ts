import type { JestConfigWithTsJest } from 'ts-jest'
import dotenv from 'dotenv';

dotenv.config()

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  moduleNameMapper: {
    "@lib/(.*)$": "<rootDir>/src/lib/$1",
    "@mixins/(.*)$": "<rootDir>/src/mixins/$1",
    "@utils/(.*)$": "<rootDir>/src/utils/$1",
    "@public/(.*)$": "<rootDir>/src/public/$1",
    "@users/(.*)$": "<rootDir>/src/services/users/$1",
    "@sessions/(.*)$": "<rootDir>/src/services/sessions/$1",
    "@posts/(.*)$": "<rootDir>/src/services/posts/$1",
    "@comments/(.*)$": "<rootDir>/src/services/comments/$1",
    "@votes/(.*)$": "<rootDir>/src/services/votes/$1",
    "@communities/(.*)$": "<rootDir>/src/services/communities/$1",
    "@awards": "<rootDir>/src/services/awards/$1",
    "@threads/(.*)$": "<rootDir>/src/services/threads/$1",
    "@types/(.*)$": "<rootDir>/src/lib/types/$1",
    "@test/(.*)$": "<rootDir>/src/lib/types/$1",
  },
}

export default jestConfig