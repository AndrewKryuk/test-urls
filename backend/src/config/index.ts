import test from './test';
import development from './development';
import * as process from 'process';

const configs = {
    test: test(),
    development: development()
};

export default () => configs[process.env.NODE_ENV] ?? configs['development'];