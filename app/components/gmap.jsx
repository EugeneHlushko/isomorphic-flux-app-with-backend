'use strict';

import React from 'react/addons';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import {IntlMixin} from 'react-intl';
import {capitalize, assign} from 'lodash';
import debug from 'debug';
import Gmapitem from 'components/_gmapItem'; // fsa fsa

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

if (process.env.BROWSER) {
  require('styles/gmap.scss');
}

export default class gmap extends React.Component {
  static propTypes = {
    flux: React.PropTypes.object.isRequired
  };

  _getIntlMessage = IntlMixin.getIntlMessage;
  _formatMessage = IntlMixin.formatMessage.bind(assign({}, this, IntlMixin));

  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          name: 'test2',
          id: 'FG2'
        },
        {
          name: 'test3',
          id: 'FG3'
        },
        {
          name: 'test4',
          id: 'FG4'
        },
      ]
    };
    debug('dev')('gmap set its items, and its state now is', this.state);
  }

  componentWillMount() {
    this._setPageTitle();
    debug('dev')('----------------------------------------', this.state);
  }

  componentDidMount() {
    var GoogleMapsLoader = require('google-maps');
    debug('dev')('did mount the map component');
    GoogleMapsLoader.load(function (google) {
      var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644)
      };
      var el = document.getElementById('gmap');
      el.style.width = '100%';
      el.style.height = window.innerHeight * 0.4 + 'px';
      new google.maps.Map(el, mapOptions);
    });
  }


  _setPageTitle = this._setPageTitle.bind(this);
  _setPageTitle() {
    let title: string;
    title = this._getIntlMessage('profile.not-found-page-title');
    // Set page title
    this.props.flux
      .getActions('page-title')
      .set(title);
  };

  //_onDeleteHandler = this._onDeleteHandler.bind(this);

  _remove = this._remove.bind(this);
  _remove(item) {
    debug('dev')('trying to remove list item');
    var items = this.state.items.filter((itm) => {
      return item.id !== itm.id;
    });

    this.setState({
      items: items
    });
  }

  render() {

    //this.items.map((name, index) => {
    //  renderItems.push(<Gmapitem key={'_fsafsa' + index} name={name.name} clickHandler={this.remove} />);
    //  //debug('dev')(name.name); //ffs
    //});
    debug('dev')('will render the component, and items are', this.state.items);
    return (
      <div>
        <h1>Protected</h1>
        <div>
          <ReactCSSTransitionGroup component="div" transitionName="example" transitionAppear={true} transitionLeave={false}>
            <Gmapitem items={this.state.items} clickHandler={this._remove}/>
          </ReactCSSTransitionGroup>
        </div>
        <div id="gmap"></div>
      </div>
    );
  }
}
