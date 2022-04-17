import Matcher from './matchers.ts';

const expect = <T = any>(value: T) => {
  const matcher = new Matcher<T>(value);
  return matcher;
};

export default expect;
