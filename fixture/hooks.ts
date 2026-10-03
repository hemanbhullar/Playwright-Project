import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import path from 'node:path';
import { TestWorld } from './TestWorld';
import { artifactDirectory } from '../utils/artifacts';

setDefaultTimeout(90_000);

Before(async function (this: TestWorld, { pickle, testCaseStartedId }) {
  this.artifactDir = await artifactDirectory(pickle.name, testCaseStartedId);
  await this.start();
});

After(async function (this: TestWorld, { result }) {
  try {
    if (result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
      const screenshot = await this.page.screenshot({ path: path.join(this.artifactDir, 'failure.png'), fullPage: true });
      await this.attach(screenshot, 'image/png');
    }
    if (this.context) {
      const trace = path.join(this.artifactDir, 'trace.zip');
      await this.context.tracing.stop({ path: trace });
      await this.attach(`Playwright trace: ${trace}`, 'text/plain');
    }
  } finally {
    await this.close();
  }
});
