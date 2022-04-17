import { describe, expect, it } from '../mod.ts';

describe('This is a describe', () => {
  it('Should be defined', () => {
    expect({}).toBeDefined();
  });

  it('Should be NaN ', () => {
    expect(parseInt('aze')).toBeNaN();
  });

  it('Should be a Date ', () => {
    expect(new Date()).toBeInstanceOf(Date);
  });

  it('Should match hello', () => {
    expect('hello world').toMatch('hello');
  });
  it('Should match /hello/', () => {
    expect('hello').toMatch(new RegExp('HellO', 'gi'));
  });

  it('Should have property', () => {
    expect({ hello: 'world', how: 'are' }).toHaveProperty('hello');
  });

  it('Should have length 3', () => {
    expect('hey').toHaveLength(3);
  });

  it('Shoud contain you', () => {
    expect('hey you').toContain('you');
  });
  it('Shoud contain item hey', () => {
    expect(['hello', 'hi', 'hey']).toContain('hey');
  });

  it('Should throw', () => {
    expect(() => {
      throw new Error('error');
    }).toThrow();
  });

  it('Should throw with error', () => {
    expect(() => {
      throw new Error('error');
    }).toThrow('error');
  });

  it('Should throw with regex error', () => {
    expect(() => {
      throw new Error('error');
    }).toThrow(/error/);
  });

  it('Should throw with Error', () => {
    expect(() => {
      throw new Error('error');
    }).toThrow(new Error('error'));
  });
});
