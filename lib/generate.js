const fs = require('fs-extra');
const path = require('path');
const Walker = require('walker');
const execSync = require('child_process');
const colors = require('colors');
const cwd = process.cwd();

let seps = cwd.split(path.sep);
let ctx = {
  CWD: cwd,
  DIRNAME: seps[seps.length - 1]
}

module.exports = (entry, callback) => {
  // let gitinfo = path.join(entry, '.git/')
  // fs.remove(gitinfo, (err) => {
  //     if (err) {
  //       return console.error(err);
  //     }
    try {
      fs.copySync(entry, './')
      console.log(colors.green('生成开发项目成功!'));
      fs.readJson('./package.json', function (err, packageObj) {
        packageObj['name'] = ctx.DIRNAME;
        fs.writeJson('./package.json', packageObj, function (err) {
          if (err) console.log(err);
          callback && callback();
        })
      })
    } catch (err) {
      console.error(err)
    }
  // })
}
