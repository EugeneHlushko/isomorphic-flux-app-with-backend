'use strict';

import debug from 'debug';

class PageMetaStore {
  constructor() {
    this.bindActions(this.alt.getActions('page-meta'));

    // Defaut values
    this.keywords = 'Very nice users, list of users,';
    this.meta = 'React js isomorphic description';
  }

  onSet(meta: Object) {
    debug('dev')(`set kw to '${meta.keywords}' and descr to '${meta.description}'`);
    return this.setState({meta});
  }
}

export default PageMetaStore;
