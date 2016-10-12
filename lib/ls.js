const spawn = require('child_process').spawn;
const colors = require('colors');
const _ = require('lodash');
const exec = require('child_process').exec;

module.exports = {
  ls (callback) {
    exec(`ls`, (error, stdout, stderr) => {
      console.log('stderr', stderr)
      console.log('stdout', stdout)
    });
  }
}
