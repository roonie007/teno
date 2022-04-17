import { $logger } from './logger.ts';

export type TestFn = (name: string, fn: () => void, timeout?: number) => void;

const test: TestFn = function (name, fn, timeout = 5000) {
  const start = Date.now();

  try {
    setTimeout(() => {
      throw new Error('TENO_TIMED_OUT');
    }, timeout);

    fn();

    const elapsedTime = Date.now() - start;
    $logger.success(name, elapsedTime);
  } catch (e) {
    if (e.message === 'TENO_TIMED_OUT') {
      const message = `Exceeded timeout of ${timeout}ms for test: ${name}`;

      $logger.fail(message);
      throw message;
    } else {
      $logger.fail(name);

      let stack: Array<string> = e.stack.split('\n');

      // Remove deno default message
      stack.shift();

      // Remove useless stack lines
      stack = stack.filter((line) =>
        line.indexOf('    at Matcher.') === -1 && line.indexOf('    at Module.assert') === -1 &&
        line.indexOf('/testing/asserts.ts:') === -1 && line.indexOf('/src/matchers.ts:') === -1
      );

      console.log(stack.join('\n'));
    }
  }

  return Promise.resolve();
};

export default test;
