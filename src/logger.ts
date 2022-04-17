import { colors } from '../deps.ts';

export enum Status {
  TEST_SKIPPED = '○',
  TEST_SUCCESS = '✓',
  TEST_FAIL = '✕',
}

export const indentation = {
  level: 0,
  size: 2,
  toString() {
    if (this.level === 0 || this.size === 0) {
      return '';
    }
    return ' '.repeat(this.size * this.level);
  },
  increase() {
    this.level++;
  },
  decrease() {
    this.level--;
    if (this.level < 0) {
      this.level = 0;
    }
  },
  reset() {
    this.level = 0;
  },
};

export const $logger = {
  log(message: string, status?: Status, elapsedTime?: number) {
    const stringElapsedTime = elapsedTime !== undefined ? `(${elapsedTime}ms)` : '';

    const coloredMessage = colors[status === undefined ? 'white' : 'gray'](`${message} ${stringElapsedTime}`);
    let coloredStatus = '';

    switch (status) {
      case Status.TEST_SUCCESS:
        coloredStatus = colors.green(Status.TEST_SUCCESS);
        break;
      case Status.TEST_FAIL:
        coloredStatus = colors.red(Status.TEST_FAIL);
        break;
      case Status.TEST_SKIPPED:
        coloredStatus = colors.brightGreen(Status.TEST_SKIPPED);
        break;
      default:
        coloredStatus = '';
    }

    const finalMessage = coloredStatus ? `${coloredStatus} ${coloredMessage}` : coloredMessage;

    console.log(`${indentation.toString()}${finalMessage}`);
  },
  success(message: string, elapsedTime?: number) {
    this.log(message, Status.TEST_SUCCESS, elapsedTime);
  },
  fail(message: string, elapsedTime?: number) {
    this.log(message, Status.TEST_FAIL, elapsedTime);
  },
  skipped(message: string, elapsedTime?: number) {
    this.log(message, Status.TEST_SKIPPED, elapsedTime);
  },
  describe(message: string) {
    this.log(message);
  },
};
