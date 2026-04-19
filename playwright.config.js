export default {
  testDir: './',
  testMatch: ['*.e2e.js'],
  use: {
    baseURL: 'http://localhost:4321',
    browserName: 'firefox',
    headless: true,
  },
};
