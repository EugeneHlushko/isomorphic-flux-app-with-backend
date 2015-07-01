'use strict';

import React from 'react/addons';
import {assign} from 'lodash';
import {RouteHandler} from 'react-router';
import debug from 'debug';

import Spinner from 'components/shared/spinner';
import Header from 'components/header';
import Footer from 'components/footer';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var cloneWithProps = React.addons.cloneWithProps;

if (process.env.BROWSER) {
  require('styles/main.scss');
}

export default class App extends React.Component {
  static propTypes = {
    flux: React.PropTypes.object.isRequired
  }

  state = this.props.flux
    .getStore('locale')
    .getState();

  componentWillMount() {
    this._setPageMeta();
  }

  _setPageMeta = this._setPageMeta.bind(this)
  _setPageMeta() {
    let meta: Object = {
      keywords: 'test new, keywords, bro',
      description: 'Whoooooa description is here',
    };

    // Set page title
    this.props.flux
      .getActions('page-meta')
      .set(meta);
  }

  componentDidMount() {
    this.props.flux
      .getStore('locale')
      .listen(this._handleLocaleChange);

    this.props.flux
      .getStore('page-title')
      .listen(this._handlePageTitleChange);

    this.props.flux
      .getStore('page-meta')
      .listen(this._handlePageMetaChange);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('locale')
      .unlisten(this._handleLocaleChange);

    this.props.flux
      .getStore('page-title')
      .unlisten(this._handlePageTitleChange);
  }

  _handleLocaleChange = this._handleLocaleChange.bind(this)
  _handleLocaleChange(state: Object) {
    return this.setState(state);
  }

  _handlePageTitleChange({title}) {
    document.title = title;
  }

  _handlePageMetaChange({meta}) {
    debug('dev')('heeey change meta?');
  }

  render() {
    const props: Object = assign({}, this.state, this.props);
    return (
      <div>
        <Spinner store={this.props.flux.getStore('requests')} />
        <Header {...props} />
        <ReactCSSTransitionGroup component="div" transitionName="example" transitionAppear={true} transitionLeave={false}>
          <div>
            <RouteHandler {...props} key={this.props.pathname} />
          </div>
        </ReactCSSTransitionGroup>
        <Footer />
      </div>
    );
  }
}
