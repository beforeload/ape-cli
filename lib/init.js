const fs = require('fs-extra');
const path = require('path')
const colors = require('colors')
const multiline = require('multiline')
const cwd = process.cwd()
const spawn = require('child_process').spawn
const prompt = require('prompt')

let seps = cwd.split(path.sep)
let ctx = {
  CWD: cwd,
  DIRNAME: seps[seps.length - 1]
}

module.exports = {
  exec(type = 'reactjs') {
    let tpl = path.join(__dirname, '..', 'templates', type)
    colors.green('初始化项目...')
    try {
      fs.copySync(tpl, './')
      console.log(colors.green('生成项目文件成功!'))
      
    } catch (err) {
      console.error(err)
    }

    console.log(colors.green('开始项目配置...'))

    prompt.start()
    prompt.get({
      properties: {
        name: {
          description: colors.cyan(`请输入项目名称: `),
          type: 'string',
          default: ctx.DIRNAME,
          required: true
        }
      }
    }, function(err, result) {
      // package.json 更新name
      fs.readJson('./package.json', function (err, packageObj) {
        packageObj['name'] = result.name || ctx.DIRNAME
        fs.writeJson('./package.json', packageObj, function (err) {
          if (err) console.log(err)
          console.log(multiline(() => {
          /*
          安装依赖及运行:
          $ ape install   安装项目依赖
          $ ape server    启动本地服务
          $ ape build     构建项目发布
          */}))
        })
      })
    })
  }
}