/* eslint-disable no-console, typescript/no-explicit-any */
export const name = 'test';

export const help = 'Testing testing';

export function run(options: any) {
  console.log('Running command', JSON.stringify(options));
}
