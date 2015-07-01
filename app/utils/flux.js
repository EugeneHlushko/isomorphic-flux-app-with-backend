'use strict';

import Alt from 'alt';
import AltResolver from './alt-resolver.js';
import debug from 'debug';

class Flux extends Alt {

  constructor(config = {}) {
    super(config);

    this._resolver = new AltResolver();

    // Register Actions
    this.addActions('requests', require('actions/requests'));
    this.addActions('locale', require('actions/locale'));
    this.addActions('users', require('actions/users'));
    this.addActions('page-title', require('actions/page-title'));
    this.addActions('page-meta', require('actions/page-meta'));

    // Register Stores
    this.addStore('requests', require('stores/requests'));
    this.addStore('locale', require('stores/locale'));
    this.addStore('users', require('stores/users'));
    this.addStore('page-title', require('stores/page-title'));
    this.addStore('page-meta', require('stores/page-meta'));
  }

  resolve(result) {
    this._resolver.resolve(result);
  }

  render(handler) {
    debug('dev')('Going to render handler in flux.js');
    return this._resolver.render(handler, this);
  }
}

export default Flux;
