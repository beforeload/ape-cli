const fs = require('fs-extra');
const ejs = require('ejs');
const path = require('path');
const Walker = require('walker');
const execSync = require('child_process');

const cwd = process.cwd();

let seps = cwd.split(path.sep);
let ctx = {
  CWD: cwd,
  DIRNAME: seps[seps.length - 1]
}

let defaultOption = {
  cwd: cwd,
  stdio: 'inherit'
}

module.exports = (entry, callback) => {
  let src = entry;
  let file = path.join(entry, 'index.js');
  if (fs.existsSync(file)) {
    let initer = require(file);
    interactor(initer, () => {
      procesure(src, initer, callback);
    })
  } else {
    procesure(src, null, callback);
  }
}

function procesure(src, initer, callback) {
  Walker(src)
    .on('dir', (dir, stat) => {
      let rel = path.relative(src, dir);
      if(!rel) return;

      let dest = path.resolve(cwd, rel);
      if(!fs.existsSync(dest)) {
        try {
          fs.mkdirsSync(dest);
        } catch(e) {
          callback && callback(e);
        }
      }
    }).on('file', (file, stat) => {
      let rel = path.relative(src, file);
      let dest = path.resolve(cwd, rel);

      if(!fs.existsSync(dest)) {
        try {
          let contents = fs.readFileSync(file, 'utf-8');
          return fs.writeFileSync(dest, parse(contents, ctx));
        } catch(e) {
          callback && callback(e)
        }
      } else {
        if(initer.overwrite) {
          let existsContents = fs.readFileSync(dest, 'utf-8');
          let contents = fs.readFileSync(file, 'utf-8');
          let newContents = initer.overwrite(existsContents, parse(contents, ctx));
          if(newContents) {
            fs.writeFileSync(dest, contents);
          }
        }
        return
      }
    }).on('end', () => {
      exec(initer, callback)
    })
}

function interactor(initer, cb) {
  let variables = initer.variables;
  var keys = Object.keys(variables);
  function next() {
    if(keys && keys.length) {
      let cur = keys.shift()
      let filed = variables[cur]
      ask(filed, (raw) => {
        let data = _.trim(raw);
        let answer = data || filed.default || '';
        ctx[cur] = parse(answer)
        if(keys.length) {
          next()
        } else {
          process.stdin.destroy();
          cb && cb();
        }
      })
    } else {
      cb && cb();
    }
  }

  next();
}

function ask(field, callback) {
  process.stdout.write('\033[90m' + parse(field.question) +  (field.default ? '(默认为' + parse(field.default) + ')' : '') + ':' + '\033[0m');
  process.stdin.setEncoding('utf8');
  process.stdin.once('data', callback).resume();
}

function parse(str) {
  return ejs.render(str, ctx);
}

function exec(initer, callback) {
  let commands =initer.commands;
  commands && command.forEach((cmd) => {
    if(cmd.command) {
      let command = parse(cmd.command);
      let options = {}
      if(command.slice(0, 3) === 'ape') {
        command += ' --child'
      }
      _.merge(options, defaultOption, cmd.options);
      for(var i in options) {
        options[i] = parse(options[i]);
      }

      let stdout;
      try {
        stdout = execSync(command, options);
      } catch(e) {
        return cmd.callback && cmd.callback(e);
      }
      return cmd.callback && cmd.callback(null, stdout)
    }
    if(typeof cmd.execute === 'function') {
      cmd.execute(ctx)
    }
  })

  callback && callback();
}
