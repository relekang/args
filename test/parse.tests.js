// @flow
import { parse } from '../src/parse';
import type { CommandOption } from '../src/types';

const run = jest.fn();
const positionalOptions: Array<CommandOption> = [
  { name: 'first', required: true },
  { name: 'second', required: false, transform: Number },
  {
    name: 'third',
    required: false,
    validate: value => (value !== 't' ? "must be 't'" : null),
  },
];
const namedOptions: Array<CommandOption> = [
  { name: 'bool', required: false, transform: Boolean },
  { name: 'amount', required: false, transform: Number },
  { name: 'required', required: true },
  {
    name: 'validate',
    required: false,
    validate: value => (value !== 't' ? "must be 't'" : null),
  },
];

test('parse should parse positional options', () => {
  const parsed = parse({ name: 't', help: 't', positionalOptions, run }, [
    'first-arg',
    '200',
  ]);

  expect(parsed).toEqual({
    _: ['first-arg', '200'],
    first: 'first-arg',
    second: 200,
  });
});

test('parse should throw on missing required positional', () => {
  const fn = () => parse({ name: 't', help: 't', positionalOptions, run }, []);

  expect(fn).toThrowErrorMatchingSnapshot();
});

test('parse should throw on positional validation error', () => {
  const fn = () =>
    parse({ name: 't', help: 't', positionalOptions, run }, [
      'first',
      'second',
      'not-t',
    ]);

  expect(fn).toThrowErrorMatchingSnapshot();
});

test('parse should parse named options', () => {
  const parsed = parse(
    { name: 't', help: 't', namedOptions, run },
    '--required o/ --validate t'.split(' ')
  );

  expect(parsed).toEqual({
    _: [],
    validate: 't',
    bool: false,
    required: 'o/',
  });
});

test('parse should parse boolean named options', () => {
  const parser = args =>
    parse({ name: 't', help: 't', namedOptions, run }, args);

  expect(parser('--required o/ --bool'.split(' '))).toEqual({
    _: [],
    bool: true,
    required: 'o/',
  });

  expect(parser('--required o/ --no-bool'.split(' '))).toEqual({
    _: [],
    bool: false,
    required: 'o/',
  });
});

test('parse should throw on missing required named', () => {
  const fn = () => parse({ name: 't', help: 't', namedOptions, run }, []);

  expect(fn).toThrowErrorMatchingSnapshot();
});

test('parse should throw on named valdiation error', () => {
  const fn = () =>
    parse(
      { name: 't', help: 't', namedOptions, run },
      '--required o/ --validate woot'.split(' ')
    );

  expect(fn).toThrowErrorMatchingSnapshot();
});
