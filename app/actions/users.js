'use strict';

import {sample, take} from 'lodash';
import debug from 'debug';
import data from 'data/users.json';
import XMLHttpRequest from 'xhr2';

class UsersActions {
  constructor() {
    this.generateActions(
      'remove', 'fetchSuccess', 'addSuccess',
      'fetchBySeedSuccess', 'duplicateSuccess'
    );
  }
  add() {
    const promise: Function = (resolve) => {
      // fake xhr
      this.alt.getActions('requests').start();
      setTimeout(() => {
        this.actions.addSuccess(sample(data.users));
        this.alt.getActions('requests').success();
        return resolve();
      }, 300);
    };
    this.alt.resolve(promise);
  }
  // will duplicate by index ( seed )
  duplicate(seed: string) {
    const promise: Function = (resolve) => {
      // fake xhr
      this.alt.getActions('requests').start();
      setTimeout(() => {
        const user: Object = data.users.find((u) => u.seed === seed);
        this.actions.duplicateSuccess(user);
        this.alt.getActions('requests').success();
        return resolve();
      }, 300);
    };
    this.alt.resolve(promise);
  }
  fetch() {
    var prv = this;
    const promise = (resolve) => {
      this.alt.getActions('requests').start();
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var _json = JSON.parse(xhr.responseText);
            debug('dev')(_json);
            prv.actions.fetchSuccess(_json);
            prv.alt.getActions('requests').success();
            return resolve();
          }
          else {
            debug('dev')('XHR failed, msg: ', xhr.responseText);
          }
        }
      };
      xhr.open('GET', 'http://localhost:3000/api/users');
      xhr.send();
    };
    this.alt.resolve(promise);
  }
  fetchBySeed(seed: string) {
    var prv = this;
    const promise = (resolve) => {
      this.alt.getActions('requests').start();
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            debug('dev')('raw reply from server', JSON.parse(xhr.responseText));
            const user: Object = JSON.parse(xhr.responseText)[0];
            prv.actions.fetchBySeedSuccess(user);
            prv.alt.getActions('requests').success();
            return resolve();
          }
          else {
            debug('dev')('XHR failed, msg: ', xhr.responseText);
          }
        }
      };
      xhr.open('GET', 'http://localhost:3000/api/users?id=' + seed);
      xhr.send();
    };
    this.alt.resolve(promise);
//    const promise = (resolve) => {
//      this.alt.getActions('requests').start();
//      setTimeout(() => {
//        const user: Object = data.users.find((u) => u.seed === seed);
//        this.actions.fetchBySeedSuccess(user);
//        this.alt.getActions('requests').success();
//        return resolve();
//      }, 300);
//    };
//    this.alt.resolve(promise);
  }
}

export default UsersActions;
