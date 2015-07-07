import url from 'url'
import route from 'koa-route'
import sql from 'sql'
import dbApi from './../db'
import debug from 'debug'

// set dialect to mysql
sql.setDialect('mysql');
  
export default route.post(
  '/api/users',
  function *() {
    // first we check if mysql is connected
    var prv = this;
		var __user = {}; // will hold info of user
    // TODO: check if user has rights to see this list
    var items = yield (callback) => {
      let raw = prv.request.url.split('?');
      let url_parts = url.parse(prv.request.url, true);
      
      //first we define our tables
			var columnsArray = ['id', 'email', 'first', 'last', 'pic'];
      var usersTable = sql.define({
        name: 'users',
        columns: columnsArray
      });
          
      // check if object wasnt empty
      var _isEmpty = () => {
        for (var key in url_parts.query) {
            if (hasOwnProperty.call(url_parts.query, key)) return false;
        }
        return true;
      }
      
      if ( _isEmpty() ) {
        __user = {
					email: 'ajoke@joke.com',
					first: 'Firstname',
					last: 'lastname',
					pic: 'http://imgz.vol.io/rotahaber/newpics/news/280220142017150168175_3.jpg',
				}
      } else {
        for (var key in url_parts.query) {
					// check if param is one of user table cols
					if ( columnsArray.indexOf(key) > -1 ) {
						__user[key] = url_parts.query[key];
					}
        }        
      }			

      // run db connection
      var _api = new dbApi();
      _api.makeConnect();
      var _dbConn = _api.getConnection();
			_dbConn.query('INSERT INTO users SET ?', __user, (err, rows, fields) => {
				if (err) throw err;
				callback(null, rows);  
			});
    };
		debug('dev')('we got next items on POST callback', items);
    this.body = JSON.stringify(items);
  }
)