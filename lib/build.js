const spawn = require('child_process').spawn
const colors = require('colors')
const _ = require('lodash')
const exec = require('child_process').exec

module.exports = {
  install (callback) {
    let ps = spawn('npm', ['install'], { cwd: process.cwd() })
    ps.stdout.pipe(process.stdout)
    ps.on('exit', (error) => {
      if(error) return
      console.log(colors.green('安装依赖完成!'))
      callback && callback()
    })
  },
  server (callback) {
    console.log(colors.cyan('开启本地服务中...'))
    let ps = spawn('npm', ['start', '--env=dev'], { cwd: process.cwd() })
    ps.stdout.pipe(process.stdout)
  },
  build (callback) {
    let ps = spawn('npm', ['run', 'build'], { cwd: process.cwd() })
    ps.stdout.pipe(process.stdout)
    ps.on('exit', (error) => {
      if(error) return
      console.log(colors.green('构建发布完成!'))
      callback && callback()
    })
  }
}
