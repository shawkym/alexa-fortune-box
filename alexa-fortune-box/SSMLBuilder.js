'use strict';

const builder = require('xmlbuilder');

class SSMLBuilder {
  constructor () {
    this.init();
  }

  /**
   *
   * @param time
   * @param unit
   * @returns {SSMLBuilder}
   */
  break (time = 0.5, unit = 's') {
    this.speak.ele('break', {
      time: `${time}${unit}`
    });

    return this;
  }

  /**
   *
   * @param url
   * @returns {SSMLBuilder}
   */
  audio (url = null) {
    if (url) {
      this.speak.ele('audio', {
        src: url
      });
    }

    return this;
  }

  /**
   *
   * @param text
   * @returns {SSMLBuilder}
   */
  text (text) {
    return this.p(text);
  }

  /**
   *
   * @param text
   * @returns {SSMLBuilder}
   */
  p (text) {
    this.speak.ele('p', null, ` ${text}`);

    return this;
  }

  /**
   *
   * @param interpretAs
   * @param value
   * @returns {SSMLBuilder}
   */
  sayAs (interpretAs, value) {
    this.speak.ele('say-as', {
      'interpret-as': interpretAs
    }, value);

    return this;
  }

  /**
   *
   * @param effect
   * @param value
   * @returns {SSMLBuilder}
   */
  awsEffect (effect, value) {
    this.speak.ele('amazon:effect', {
      'name': effect
    }, value);

    return this;
  }

  /**
   *
   * @param name
   * @param attributes
   * @param value
   * @returns {SSMLBuilder}
   */
  add (name, attributes = {}, value = null) {
    this.speak.ele(name, attributes, value);

    return this;
  }

  /**
   *
   * @param pretty
   * @returns {*|void|number}
   */
  getSpeak (pretty = false) {
     let res = this.speak.end({
      pretty: pretty
    });
    return res.replace('<speak>', '').replace('</speak>', '');
  }

  /**
   *
   * @param name
   * @param attributes
   * @param value
   * @returns {string}
   */
  static raw (name, attributes = {}, value = null) {
    const ele = builder.create('root', null, null, {headless: true});
    ele.ele(name, attributes, value);
    let elementString = ele.end();
    
    return elementString.replace('<root>', '').replace('</root>', '');
  }

  /**
   *
   * @returns {SSMLBuilder}
   */
  init () {
    this.speak = {};
    this.speak = builder.create("speak", null, null, {headless: true});
    return this;
  }
}

module.exports = SSMLBuilder;