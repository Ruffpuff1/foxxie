const path = require('node:path');
const { workerData } = require('node:worker_threads');

require(path.resolve(workerData.path));
