# PIGNOSE Calendar

Beautiful and eidetic jQuery date picker plugin.

[![Build Status](https://travis-ci.org/KennethanCeyer/pg-calendar.svg?branch=master)](https://travis-ci.org/KennethanCeyer/pg-calendar) [![Coverage Status](https://coveralls.io/repos/github/KennethanCeyer/pg-calendar/badge.svg?branch=master)](https://coveralls.io/github/KennethanCeyer/pg-calendar?branch=master) [![codecov](https://codecov.io/gh/KennethanCeyer/pg-calendar/branch/master/graph/badge.svg)](https://codecov.io/gh/KennethanCeyer/pg-calendar)

[![npm version](https://badge.fury.io/js/pg-calendar.svg)](https://badge.fury.io/js/pg-calendar) [![npm downloads](https://img.shields.io/npm/dm/pg-calendar.svg?maxAge=2592000)](https://www.npmjs.com/package/pg-calendar) [![Bower version](https://badge.fury.io/bo/pg-calendar.svg)](https://badge.fury.io/bo/pg-calendar) [![GitHub license](https://img.shields.io/github/license/KennethanCeyer/pg-calendar.svg)](https://github.com/KennethanCeyer/pg-calendar/blob/master/LICENSE) [![Join the chat at https://gitter.im/KennethanCeyer/PIGNOSE](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/KennethanCeyer/PIGNOSE?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![dependencies Status](https://david-dm.org/kennethanceyer/pg-calendar/status.svg)](https://david-dm.org/kennethanceyer/pg-calendar) [![devDependencies Status](https://david-dm.org/kennethanceyer/pg-calendar/dev-status.svg)](https://david-dm.org/kennethanceyer/pg-calendar?type=dev)

----

### Getting started

PIGNOSE-Calendar helps you to make simple and eidetic datepicker with jQuery.

This datepicker supports responsive display and mobile environment.

[Check demo page](http://www.pigno.se/barn/PIGNOSE-Calendar)

![PIGNOSE-Calendar](http://www.pigno.se/barn/PIGNOSE-Calendar/demo/img/screenshot_main.png?t=201701170854)

----

### Documentation

Check [:book: GitHub wiki](https://github.com/KennethanCeyer/pg-calendar/wiki/Documentation).

or [:package: Codepen.io collection](https://codepen.io/collection/Dbgpqm/)

----

## Installation

### NPM

```bash
$ npm install pg-calendar
```

### Bower

```bash
$ bower install pg-calendar
```

### Yarn

```bash
$ yarn add pg-calendar
```

----

### Usage

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

----

### Test

Current version supports unit tests by using `mocha` and `chai`.

```bash
# install all dependencies including devdependencies
$ npm install

# run test script of package.json
$ npm test
```

----

### Overview

See our features which we are supported.

- Responsive and mobile friendly display.
- Multiple range datepicker support.
- Scheduling calendar support.
- Input type controller support.
- The toggle controll each of date buttons are supported.
- You can disable specific dates.
- Multiple languages are supported, (en, ko, fr, ch, de, jp, pt, da, pl, es, fa, it, cs, uk, ru).
- Theme system supports (light, dark, blue).

----

### Contributors

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

#### Join in contribution

Please move to [Contribution section](https://github.com/KennethanCeyer/PIGNOSE-Calendar/wiki/Contribution).

----

### Question

If you found something problem of this plugin, or you have some question.

Please send me a message to use either [gitter](https://gitter.im/KennethanCeyer/PIGNOSE) or [Github issue](https://github.com/KennethanCeyer/PIGNOSE-Calendar/issues). (gitter url is on the top of the manual)

----

### Todo



- [x] Support Webpack, AMD and CommonJS (UMD).
- [x] Support ES6 with babel.
- [x] Documentation supporting.
- [x] Move css file to less.
- [x] Integration with CI and Coverages.
- [x] Add unit tests.
- [ ] Add e2e tests.
- [ ] Adding timepicker specs.
- [ ] Making many sample codes.
- [ ] Improvement and building detailed callbacks. (Progress)

----

### Roadmap

**1.4.x**

- 100% coverage unit test
- support UMD
- support Webpack
- support typescript definition
- complete documentation

**1.5.x**

- complete examples for combination of all options
- support e2e testing with nightwatch
- support codepen examples
- following convention (webstorm convention of JetBrains)
- making integrated library with react
- making integrated library with angular
- making integrated library with vuejs

**1.6.x**

- extended option usage `time picker`
- advanced option `custom button (today, last 7days, last 30 days, last a month, last 6 month, last year)`
- advanced option `attach below of input`
