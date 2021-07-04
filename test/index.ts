import { getTime } from './time';
// import { config } from '@config';

export function test(str?: string) {
  const _config = str;
  const _time = '111';
  return {
    time: _time,
    config: _config
  };
}

const data = test();
console.log(data);
