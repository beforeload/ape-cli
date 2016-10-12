const spawn = require('child_process').spawn;
const colors = require('colors');
const _ = require('lodash');
const exec = require('child_process').exec;
const fs = require('fs-extra')

module.exports = {
  test (callback) {
    fs.readJson('./package.json', function (err, packageObj) {
      console.log(colors.cyan('发布'), colors.yellow(packageObj.name), colors.cyan('到测试环境'))
      let ps = spawn('sh', ['test.sh', packageObj.name], {
        cwd: process.cwd()
      })
      ps.on('exit', (error) => {
        if (error) return;
        console.log(colors.green('发布成功'));
      })
    })
  },
  online (callback) {
    fs.readJson('./package.json', function (err, packageObj) {
      console.log(colors.cyan('发布'), colors.yellow(packageObj.name), colors.cyan('到线上环境'))
      let ps = spawn('sh', ['product.sh', packageObj.name], {
        cwd: process.cwd()
      })
      ps.on('exit', (error) => {
        if (error) return;
        console.log(colors.green('发布成功'));
      })
    })
  }
}
