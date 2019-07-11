<h1 align="center">PIGNOSE Calendar :date:</h1>

<p align="center">Beautiful and eidetic jQuery date picker plugin</p>

<p align="center"><a href="https://nodei.co/npm/pg-calendar/"><img src="https://nodei.co/npm/pg-calendar.png" alt="NPM"></a></p>

<p align="center">
  <a href="https://travis-ci.org/KennethanCeyer/pg-calendar"><img src="https://travis-ci.org/KennethanCeyer/pg-calendar.svg?branch=master" alt="Build Status"></a>
  <a href="https://coveralls.io/github/KennethanCeyer/pg-calendar?branch=master"><img src="https://coveralls.io/repos/github/KennethanCeyer/pg-calendar/badge.svg?branch=master" alt="Coverage Status"></a>
  <a href="https://codecov.io/gh/KennethanCeyer/pg-calendar"><img src="https://codecov.io/gh/KennethanCeyer/pg-calendar/branch/master/graph/badge.svg" alt="codecov"></a>
</p>

<p align="center">
  <a href="https://badge.fury.io/js/pg-calendar"><img src="https://badge.fury.io/js/pg-calendar.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/pg-calendar"><img src="https://img.shields.io/npm/dm/pg-calendar.svg?maxAge=2592000" alt="npm downloads"></a>
  <a href="https://github.com/KennethanCeyer/pg-calendar/blob/master/LICENSE"><img src="https://img.shields.io/github/license/KennethanCeyer/pg-calendar.svg" alt="GitHub license"></a>
  <a href="https://gitter.im/KennethanCeyer/PIGNOSE?utm_source=badge&amp;utm_medium=badge&amp;utm_campaign=pr-badge&amp;utm_content=badge"><img src="https://badges.gitter.im/Join%20Chat.svg" alt="Join the chat at https://gitter.im/KennethanCeyer/PIGNOSE"></a>
</p>

<p align="center">
  <a href="https://www.codefactor.io/repository/github/kennethanceyer/pg-calendar"><img src="https://www.codefactor.io/repository/github/kennethanceyer/pg-calendar/badge" /></a>
  <a href="https://codeclimate.com/github/KennethanCeyer/pg-calendar/maintainability"><img src="https://api.codeclimate.com/v1/badges/e46890fbd4a5f14603b4/maintainability" /></a>
  <a href="https://codeclimate.com/github/KennethanCeyer/pg-calendar/test_coverage"><img src="https://api.codeclimate.com/v1/badges/e46890fbd4a5f14603b4/test_coverage" /></a>
  <a href="https://david-dm.org/kennethanceyer/pg-calendar"><img src="https://david-dm.org/kennethanceyer/pg-calendar/status.svg" alt="dependencies Status"></a>
  <a href="https://david-dm.org/kennethanceyer/pg-calendar?type=dev"><img src="https://david-dm.org/kennethanceyer/pg-calendar/dev-status.svg" alt="devDependencies Status"></a>
</p>

## :clap: Getting started

PIGNOSE-Calendar helps you to make simple and eidetic datepicker with jQuery.

This datepicker supports responsive display and mobile environment.

[Check demo page](http://www.pigno.se/barn/PIGNOSE-Calendar)

![PIGNOSE-Calendar](http://www.pigno.se/barn/PIGNOSE-Calendar/demo/img/screenshot_main.png?t=201701170854)

## :page_with_curl: Documentation

Check [:book: GitHub wiki](https://github.com/KennethanCeyer/pg-calendar/wiki/Documentation).

or [:package: Codepen.io collection](https://codepen.io/collection/Dbgpqm/)

## :package: Installation

### npm

```bash
$ npm install pg-calendar
```

### yarn

```bash
$ yarn add pg-calendar
```

## :triumph: Usage

Check `dist/` folder on this repository.

1. Install from git.

 ```bash
$ git clone git@github.com:KennethanCeyer/PIGNOSE-Calendar.git
```

2. Check distributed folder.

 ```bash
 $ cd ./PIGNOSE-Calendar/dist
 $ ls -al
```

3. Insert snippets at `<head>` tag of your html file.

 ```html
<script src="./dist/js/pignose.calendar.min.js"></script>
<link type="text/css" href="./dist/css/pignose.calendar.min.css" />
```

## :space_invader: Test

Current version supports unit tests by using `mocha` and `chai`.

```bash
# install all dependencies including devdependencies
$ npm install

# run test script of package.json
$ npm test
```

## :beer: Overview

See our features which we are supported

- Responsive and mobile friendly display
- Multiple range datepicker support
- Scheduling calendar support
- Input type controller support
- The toggle controll each of date buttons are supported
- You can disable specific dates
- Multiple languages are supported, (ar, en, ko, fr, ch, de, jp, pt, da, pl, es, fa, it, cs, uk, ru, ka, ca)
- Theme system supports (light, dark, blue)

## :octocat: Contributors

We welcome your support, You can support to notice by send me github issue or using gitter.

#### Languages

- [@adrian2monk](https://www.github.com/adrian2monk)
- [@feldmarv](https://www.github.com/feldmarv)
- [@matheusdelima](https://www.github.com/matheusdelima)
- [@maxma51](https://www.github.com/maxma51)
- [@pkly](https://www.github.com/pkly)
- [@TNDecoder](https://www.github.com/TNDecoder)
- [@acipolla](https://www.github.com/acipolla)
- [@jan-vince](https://github.com/jan-vince)
- [@SMHFandA](https://github.com/SMHFandA)
- [@davitperaze](https://github.com/davitperaze)
- [@ahmadalfy](https://github.com/ahmadalfy)
- [@orioltestart](https://github.com/orioltestart)

#### Join in contribution

Please move to [Contribution section](https://github.com/KennethanCeyer/PIGNOSE-Calendar/wiki/Contribution).

## :triangular_flag_on_post: Roadmap

- [x] Support Webpack, AMD and CommonJS (UMD)
- [x] Support ES6 with babel
- [x] Documentation supporting
- [x] Move css file to less
- [x] Integration with CI and Coverages
- [x] Add unit tests

**1.4.x**

- [ ] Add e2e tests.
- [ ] Adding timepicker specs.
- [ ] Making many sample codes.
- [ ] Improvement and building detailed callbacks. (Progress)
- [ ] 100% coverage unit test
- [ ] support UMD
- [ ] support Webpack
- [ ] support typescript definition
- [ ] complete documentation

**1.5.x**

- [ ] complete examples for combination of all options
- [ ] support e2e testing with nightwatch
- [ ] support codepen examples
- [ ] following convention (webstorm convention of JetBrains)
- [ ] making integrated library with react
- [ ] making integrated library with angular
- [ ] making integrated library with vuejs

**1.6.x**

- [ ] extended option usage `time picker`
- [ ] advanced option `custom button (today, last 7days, last 30 days, last a month, last 6 month, last year)`
- [ ] advanced option `attach below of input`

## :mag: License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FKennethanCeyer%2Fpg-calendar.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FKennethanCeyer%2Fpg-calendar?ref=badge_large)

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
