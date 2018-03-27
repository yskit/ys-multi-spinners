const cli = require('../index');
const path = require('path');
const cluster = require('cluster');
const childprocess = require('child_process');
const common = new cli({
  master: 'loading ...',
  work_0: 'loading ...',
  work_1: 'loading ...',
  agent: 'loading ...'
});

const master = common.get('master');

const ls = childprocess.fork(path.resolve(__dirname, 'worker.js'), {
  silent: true
});

common.agent('agent', ls);

cluster.setupMaster({
  exec: path.resolve(__dirname, 'worker.js'),
  silent: true
});
const fork_0 = cluster.fork(); // https worker
common.worker('work_0', fork_0);

cluster.setupMaster({
  exec: path.resolve(__dirname, 'worker.js'),
  silent: true
});
const fork_1 = cluster.fork(); // http worker
common.worker('work_1', fork_1);
// process.stdout.on('data', data => {
//   master.info(data.toString().replace(/^\n/g, ''));
// });

master.info('master is ready')

process.on('SIGINT', () => {
  setTimeout(() => {
    process.exit(0);
  }, 5000);
});