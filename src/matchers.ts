// deno-lint-ignore-file ban-types
import { asserts, colors } from '../deps.ts';

interface GenerateErrorMessageArgs {
  actual: any;
  expected?: any;

  actualValue?: any;

  fnName: string;
  message?: string;
}

const getValueToDisplay = (value: any) => {
  if (value === undefined) {
    return 'undefined';
  } else if (value === null) {
    return 'null';
  } else if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value.toString();
};

const generateErrorMessage = ({ expected, actual, actualValue, fnName, message = '' }: GenerateErrorMessageArgs) => {
  const actualToWriteInFunction = getValueToDisplay(actual);
  const expectToWrite = getValueToDisplay(expected);

  const actualToWriteInDiff = getValueToDisplay(actualValue ?? actualToWriteInFunction);

  if (expected) {
    return `


    [Diff] ${colors.red('Actual')} / ${colors.brightGreen('Expected')}
    expect(${colors.red(actualToWriteInFunction)}).${colors.gray(fnName)}(${
      colors.brightGreen(expected.toString())
    }) -- ${message}

    ${colors.red(`- ${actualToWriteInDiff}`)}
    ${colors.brightGreen(`+ ${expectToWrite}`)}
    
  
    `;
  } else {
    return `

    expect(${colors.red(actualToWriteInFunction)}).${colors.gray(fnName)}()

    ${colors.red(actualToWriteInFunction)} ${message}  
    `;
  }
};

const tryToThrowWithMessage = (result = true, args: GenerateErrorMessageArgs) => {
  if (!result) {
    throw new Error(generateErrorMessage(args));
  }
};

class Matcher<T = any> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  toBe(value: Partial<T>) {
    const result = this.value === value;
    tryToThrowWithMessage(result, {
      actual: this.value,
      expected: value,
      fnName: 'toBe',
    });
  }
  toEqual(value: Partial<T>) {
    const result = asserts.equal(this.value, value);
    tryToThrowWithMessage(result, {
      actual: this.value,
      expected: value,
      fnName: 'toEqual',
    });
  }

  toBeTruthy() {
    let result = false;
    if (this.value) {
      result = true;
    }
    tryToThrowWithMessage(result, {
      actual: this.value,
      fnName: 'toBeTruthy',
      message: 'is not truthy',
    });
  }
  toBeFalsy() {
    let result = false;
    if (!this.value) {
      result = true;
    }

    tryToThrowWithMessage(result, {
      actual: this.value,
      fnName: 'toBeFalsy',
      message: 'is not falsy',
    });
  }

  toBeDefined() {
    let result = false;
    if (this.value !== undefined) {
      result = true;
    }

    tryToThrowWithMessage(result, {
      actual: this.value,
      fnName: 'toBeDefined',
      message: 'is not defined',
    });
  }
  toBeUndefined() {
    let result = false;
    if (this.value === undefined) {
      result = true;
    }

    tryToThrowWithMessage(result, {
      actual: this.value,
      fnName: 'toBeUndefined',
      message: 'is defined but should be undefined',
    });
  }

  toBeNull() {
    let result = false;
    if (this.value === null) {
      result = true;
    }

    tryToThrowWithMessage(result, {
      actual: this.value,
      fnName: 'toBeNull',
      message: 'should be null',
    });
  }

  toBeNaN() {
    let result = false;
    if (isNaN(this.value as unknown as number)) {
      result = true;
    }

    tryToThrowWithMessage(result, {
      actual: this.value,
      fnName: 'toBeNaN',
      message: 'should be NaN',
    });
  }

  toBeInstanceOf(value: Function) {
    let result = false;
    if (this.value instanceof value) {
      result = true;
    }

    tryToThrowWithMessage(result, {
      actual: value.name,
      expected: (this.value as unknown as Function).constructor.name,
      fnName: 'toBeInstanceOf',
    });
  }

  toMatch(value: string | RegExp) {
    let result = false;

    if (typeof value === 'string') {
      result = (this.value as unknown as string).indexOf(value) !== -1;
    } else if (value instanceof RegExp) {
      if (value.exec(this.value as unknown as string)) {
        result = true;
      }
    }

    tryToThrowWithMessage(result, {
      actual: value.toString(),
      expected: this.value,
      fnName: 'toMatch',
    });
  }

  // ####################################################
  // #### Comparison
  // ####################################################
  toBeGreaterThan(value: number) {
    const result = (this.value as unknown as number) > value;

    tryToThrowWithMessage(result, {
      actual: value,
      expected: this.value,
      fnName: 'toBeGreaterThan',
    });
  }
  toBeGreaterThanOrEqual(value: number) {
    const result = (this.value as unknown as number) >= value;

    tryToThrowWithMessage(result, {
      actual: value,
      expected: this.value,
      fnName: 'toBeGreaterThanOrEqual',
    });
  }

  toBeLessThan(value: number) {
    const result = (this.value as unknown as number) < value;

    tryToThrowWithMessage(result, {
      actual: value,
      expected: this.value,
      fnName: 'toBeLessThan',
    });
  }
  toBeLessThanOrEqual(value: number) {
    const result = (this.value as unknown as number) <= value;

    tryToThrowWithMessage(result, {
      actual: value,
      expected: this.value,
      fnName: 'toBeLessThanOrEqual',
    });
  }

  // ####################################################
  // #### Objects
  // ####################################################

  toHaveProperty(value: string) {
    const parsedValue = this.value as Record<string, unknown>;
    const result = typeof parsedValue === 'object' &&
      typeof parsedValue[value] !== 'undefined';

    tryToThrowWithMessage(result, {
      actual: JSON.stringify(parsedValue),
      actualValue: JSON.stringify(Object.keys(parsedValue)),
      expected: value,
      fnName: 'toHaveProperty',
    });
  }

  // ####################################################
  // #### Erros
  // ####################################################
  toThrow(error?: string | RegExp | Error) {
    let result = false;
    let failReason = '';
    let gotError: Error | undefined;

    let expected = '';
    let actual = '';
    let actualValue = '';

    const fn = this.value as unknown as Function;
    try {
      fn();
    } catch (err) {
      gotError = err;
    }

    if (gotError) {
      result = true;

      if (error) {
        if (typeof error === 'string') {
          if (!gotError.message.includes(error)) {
            result = false;
            expected = error;
            actual = fn.name;
            actualValue = gotError.message.toString();
            failReason = `to throw error matching ${colors.brightGreen(expected)} but it threw ${
              colors.red(actualValue)
            }`;
          }
        } else if (error instanceof RegExp) {
          if (!gotError.message.match(error)) {
            result = false;
            expected = error.toString();
            actual = fn.name;
            actualValue = gotError.message.toString();

            failReason = `to throw error matching ${colors.brightGreen(expected)} but it threw ${
              colors.red(actualValue)
            }`;
          }
        } else if (error instanceof Error) {
          if (!gotError.message.includes(error.message)) {
            result = false;
            expected = error.message;
            actual = fn.name;
            actualValue = gotError.message.toString();

            failReason = `to throw error matching ${colors.brightGreen(expected)} but it threw ${
              colors.red(actualValue)
            }`;
          }
        } else {
          result = false;
        }
      }
    } else {
      failReason = 'did not throw';
    }

    tryToThrowWithMessage(result, {
      actual: actual || fn.toString().replace(/(\r\n|\n|\r)/gm, ''),
      actualValue,
      expected,
      fnName: 'toThrow',
      message: failReason,
    });
  }

  // ####################################################
  // #### Extra
  // ####################################################

  toHaveLength(value: number) {
    const valueLength = (this.value as unknown as string | Array<unknown>).length;
    const result = valueLength === value;

    tryToThrowWithMessage(result, {
      actual: this.value,
      actualValue: valueLength,
      expected: value,
      fnName: 'toHaveLength',
    });
  }

  toContain(value: any) {
    const parsedValue = this.value as unknown as Array<unknown>;
    const result = parsedValue && typeof parsedValue.includes === 'function' && parsedValue.includes(value);

    tryToThrowWithMessage(result, {
      actual: this.value,
      expected: value,
      fnName: 'toContain',
    });
  }
}

export default Matcher;
