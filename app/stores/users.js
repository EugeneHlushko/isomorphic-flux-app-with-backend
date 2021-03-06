'use strict';

import {isEmpty} from 'lodash';
import debug from 'debug';

class UsersStore {

  constructor() {
    this.bindActions(this.alt.getActions('users'));
    this.users = [];
  }

  static getBySeed(seed) {
    debug('dev')('**************** in get by seed', this.getState().users, 'seed was ', seed);
    const users: Array<Object> = this.getState().users;
    return {user: users.find((user) => (parseInt(user.id) === parseInt(seed)))};
  }

  onRemoveSuccess(userId) {
    const users: Array<Object> = this.users.slice();
    let occurrence: ?Object = users.find((u) => u.id === userId);
//    if (occurrence) {
//      occurrence = userId;
//    }
    let __index = users.indexOf(occurrence);
    debug('dev')('we got object to remove', occurrence, 'and we have users', users);
    users.splice(__index, 1);
    return this.setState({users});
  }

  onAddSuccess(user) {
    const users: Array<Object> = this.users.slice();
    debug('dev')('WE DID ADD A NICE USER', user);
    users.push(user);
    return this.setState({users});
  }

  onDuplicateSuccess(user) {
    const users: Array<Object> = this.users.slice();
    users.push(user);

    return this.setState({users});
  }

  onFetchSuccess(users) {
    this.setState({users: users});
  }

  onFetchBySeedSuccess(user) {
    const users: Array<Object> = this.users.slice();
    let occurrence: ?Object = users.find((u) => u.id === user.id);
    if (occurrence) {
      occurrence = user;
    }
    else if (user) {
      user.name = user.last + ' ' + user.first;
      users.push(user);
    }
    debug('dev')('we got a nice user occurance! ', users);
    return this.setState({users});
  }

}

export default UsersStore;
