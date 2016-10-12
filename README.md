A project demo generator
========================

### Install

```shell
$ [sudo] npm install -g ape-cli
```
### Usage

```
Usage: ape   [command] [options]


  Commands:

    init [type]       初始化项目目录
    install           安装项目依赖
    server            开启本地服务
    build [options]   执行项目构建

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    $ ape init -h
    $ ape install
    $ ape server
    $ ape build

  FAQ: https://github.com/beforeload/ape-cli/issues

```

### Init Projects

__React.js Project (Default)__

```shell
$ ape init
```

1. Integrated Components
  * webpack
  * ES6 Babel