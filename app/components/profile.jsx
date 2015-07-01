'use strict';

import React from 'react';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import {IntlMixin} from 'react-intl';
import {capitalize, assign} from 'lodash';
import debug from 'debug';

if (process.env.BROWSER) {
  require('styles/profile.scss');
}

export default class Profile extends React.Component {
  static propTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired
  }

  _getIntlMessage = IntlMixin.getIntlMessage
  _formatMessage = IntlMixin.formatMessage.bind(assign({}, this, IntlMixin))

  state = this.props.flux
    .getStore('users')
    .getBySeed(this.props.params.seed)

  componentWillMount() {
    debug('dev')('****************************Component WILL, and state was', this.state);
    this._setPageTitle();

    this.props.flux
      .getActions('users')
      .fetchBySeed(this.props.params.seed);
  }

  componentDidMount() {
    debug('dev')('****************************Component mounted, and state was', this.state);
    this.props.flux
      .getStore('users')
      .listen(this._handleStoreChange);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('users')
      .unlisten(this._handleStoreChange);
  }

  _handleStoreChange = this._handleStoreChange.bind(this)
  _handleStoreChange() {
    const user: ?Object = this.props.flux
      .getStore('users')
      .getBySeed(this.props.params.seed);

    return this.setState(user);
  }

  _setPageTitle = this._setPageTitle.bind(this)
  _setPageTitle() {
    let title: string;

    if (this.state.user) {
      const user: Object = this.state.user;
      const fullName: string = this._getFullName(user.first, user.last);

      title = this._getIntlMessage('profile.page-title');
      title = this._formatMessage(title, {fullName});

    }
    else {
      title = this._getIntlMessage('profile.not-found-page-title');
    }

    // Set page title
    this.props.flux
      .getActions('page-title')
      .set(title);
  }

  _getFullName(first, last) {
    return `${first} ${last}`;
  }

  _goBackHandler = this._goBackHandler.bind(this)
  _goBackHandler() {
    debug('dev')('we can go back!!!');
    this.context.router.goBack();
  }

  render() {
    if (this.state.user) {
      const user: Object = this.state.user;
      return (
        <div className='app--profile'>
          <h2>{this._getFullName(user.first, user.last)}</h2>
          <img
            src={user.pic}
            alt='profile picture' />
          <hr/>
          <div onClick={this._goBackHandler.bind(null)}>Go back</div>
        </div>
      );
    }
    else {
      return (
        <h2>User not found</h2>
      );
    }
  }
}
