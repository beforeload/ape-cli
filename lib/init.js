const fs = require('fs-extra');
const path = require('path')
const colors = require('colors')
const pkg = require('../package.json')
const _ = require('lodash')
const exec = require('child_process').exec
const os = require('os')
const cwd = process.cwd()
const spawn = require('child_process').spawn
const execSync = require('child_process').execSync
const generate = require('./generate')
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
        },
        reviewers: {
          description: colors.cyan('请输入代码审核人(example: reviewer[,reviewer ...])'),
          pattern: /^\w+$/,
          message: '代码审核人不能为空',
          required: true
        }
      }
    }, function(err, result) {
      // package.json 更新name
      fs.readJson('./package.json', function (err, packageObj) {
        packageObj['name'] = result.name || ctx.DIRNAME
        fs.writeJson('./package.json', packageObj, function (err) {
          if (err) console.log(err)
        })
      })

      let deployTest = `#!/bin/bash
echo "deploy ${result.name} to test"
npm run build

cd dist/

for j in $(ls);
do
  echo $j
  RSYNC_PASSWORD=2aHbStbT2LXn rsync -avzp $j  rsyncer@soho-common-static-nginx1-test::static/ape/h5/${result.name}/
done;
      `

      let deployOnline = `#!/bin/bash
echo "deploy ${result.name} to online"
npm run build

cd dist/
for j in $(ls);
do
  RSYNC_PASSWORD=2aHbStbT2LXn rsync -avzp $j  rsyncer@dx-common-static-nginx1-online::static/ape/h5/${result.name}/
  RSYNC_PASSWORD=2aHbStbT2LXn rsync -avzp $j  rsyncer@dx-common-static-nginx2-online::static/ape/h5/${result.name}/
done;
      `
      /* 生成两个发布文件 */
      fs.outputFile('test.sh', deployTest, function (error) {
        if(error) {
          console.log(error)
        }
        console.log(colors.green('生成 test.sh 成功！'))
      })
      fs.outputFile('product.sh', deployOnline, function(error) {
        if(error) {
          console.log(error)
        }
        console.log(colors.green('生成 product.sh 成功！'))
      })

      console.log(colors.cyan('你将添加'), colors.yellow(result.reviewers), colors.cyan('为您的代码审阅人员'))
      exec(`sh initGit.sh ${result.reviewers}`, (error, stdout, stderr) => {
        if (error) {
          return console.error(colors.red(`运行错误: ${error}`))
        }
        console.log(colors.green('配置代码审核人成功!'))
        console.log(colors.cyan('提交代码：'), colors.yellow('git push review'))
        console.log(stdout)
        console.log(colors.red(stderr))
      })
    })

  }
}
