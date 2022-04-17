import { $logger, indentation } from './logger.ts';

export default (name: string, fn: () => void) => {
  $logger.describe(name);
  indentation.increase();
  fn();
  indentation.decrease();
};
