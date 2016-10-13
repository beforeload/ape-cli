const multiline = require('multiline')
const spawn = require('child_process').spawn
const colors = require('colors')


function runCommand(command, args, callback) {
  let ps = spawn(command, args, { cwd: process.cwd() })
  ps.stdout.pipe(process.stdout)

  ps.on('exit', (error) => {
    if(error) return
    callback && callback()
  })
}

module.exports = {
  install() {
    console.log(colors.cyan('安装项目依赖...'))
    runCommand('npm', ['install'], () => {
      console.log(colors.green('安装依赖完成!'))
    })
  },
  
  server() {
    console.log(colors.cyan('开启本地服务中...'))
    runCommand('npm', ['start', '--env=dev'])
  },
  
  build() {
    console.log(colors.cyan('构建发布中...'))

    runCommand('npm', ['run', 'build'], () => {
      console.log(colors.green('构建发布完成!\n'))
    })
  },
  
  // test() {
  //   console.log(colors.cyan('正在发布测试环境...'))
  //   runCommand('sh', ['test.sh'], () => {
  //     console.log(colors.green('发布测试环境完成!'))
  //   })
  // },
  
  // online() {
  //   console.log(colors.cyan('正在发布线上环境...'))
  //   runCommand('sh', ['product.sh'], () => {
  //     console.log(colors.green('发布线上环境完成!'))
  //   })
  // }
}
