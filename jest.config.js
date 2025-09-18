module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/__tests__/**/*.(ts|tsx|js)", "**/*.(test|spec).(ts|tsx|js)"],
  collectCoverageFrom: [
    "utils/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "lcov", "html"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};