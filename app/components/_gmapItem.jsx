import React from 'react/addons';
import debug from 'debug';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

if (process.env.BROWSER) {
  require('styles/gmap.scss');
}

export default class Gmapitem extends React.Component {

  render() {
    debug('dev')('props name was received and', this.props.name);
    var items = this.props.items.map((item, i) => {
      return (
        <li key={i} onClick={this.props.clickHandler.bind(null, item)}>
          {item.name}
        </li>
      );
    }.bind(this));
    return <ul>{items}</ul>;
  }
}
