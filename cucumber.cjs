const path = require('node:path');
const reportDir = process.env.REPORT_DIR || 'report/manual';

module.exports = {
  default: {
    paths: [process.env.FEATURE_PATH || 'features/cart.feature'],
    requireModule: ['ts-node/register'],
    require: ['fixture/**/*.ts', 'step-definitions/**/*.ts'],
    format: [
      'progress',
      `json:${path.join(reportDir, 'cucumber.json')}`,
      `html:${path.join(reportDir, 'cucumber.html')}`,
      `cucumber-js-extent:${path.join(reportDir, 'extent.html')}`,
    ],
    parallel: 1,
    retry: 0,
    strict: true,
  },
};
