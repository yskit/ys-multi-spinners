const multispinner = require('multispinner');
const colors = require('./colors');
const is = require('is-type-of');

class single {
  constructor(name, target) {
    this.name = name;
    this.target = target;
  }

  log(state, ...args) {
    this.target.state = state;
    this.target.text = `${colors.gray}[${this.name}]${colors.colorClose} ` + args.map(v => {
      if (is.error(v)) return v.message;
      if (typeof v !== 'string') {
        return JSON.stringify(v, null, 2);
      }
      return v;
    }).join(' ');
  }

  info(...args) {
    this.log('incomplete', ...args);
  }

  error(...args) {
    this.log('error', ...args);
  }

  success(...args) {
    this.log('success', ...args);
  }
}

module.exports = class ConsoleSpinner {
  constructor(names, options = {}) {
    this.multi = new multispinner(names, Object.assign({
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
      indent: 2,
      interval: 50,
      color: {
        incomplete: 'blue',
        success: 'green',
        error: 'red'
      }
    }, options));
  }

  format(data) {
    return data.toString().replace(/^\n+/, '').replace(/\n+$/, '');
  }

  get(name) {
    if (!this.multi.spinners[name]) {
      throw new Error(`bind failed: ${name} is not exists.`);
    }
    // this.multi.spinners[name].state = 'incomplete';
    return new single(name, this.multi.spinners[name]);
  }

  worker(name, processer) {
    const spinner = this.get(name);
    processer.process.stdout.on('data', data => {
      spinner.info(this.format(data));
    });
    processer.process.stderr.on('data', data => {
      spinner.error(this.format(data));
    });
  }

  agent(name, processer) {
    const spinner = this.get(name);
    processer.stdout.on('data', data => {
      spinner.info(this.format(data));
    });
    processer.stderr.on('data', data => {
      spinner.error(this.format(data));
    });
  }
}

module.exports.single = single;