import type { JestConfigWithTsJest } from 'ts-jest'
import dotenv from 'dotenv';

dotenv.config()

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/$1",
  },
}

export default jestConfig