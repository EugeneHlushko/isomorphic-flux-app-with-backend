import url from 'url'
import route from 'koa-route'
import sql from 'sql'
import dbApi from './../db'
import debug from 'debug'

// set dialect to mysql
sql.setDialect('mysql');
  
export default route.get(
  '/api/users',
  function *() {
    // first we check if mysql is connected
    var prv = this;
    // TODO: check if user has rights to see this list
    var items = yield (callback) => {
      let raw = prv.request.url.split('?');
      let url_parts = url.parse(prv.request.url, true);
      
      //first we define our tables
      var usersTable = sql.define({
        name: 'users',
        columns: ['id', 'email', 'first', 'last', 'pic']
      });
          
      // check if object wasnt empty
      var _isEmpty = () => {
        for (var key in url_parts.query) {
            if (hasOwnProperty.call(url_parts.query, key)) return false;
        }
        return true;
      }
      
      if ( _isEmpty() ) {
        var _query = usersTable
          .select(usersTable.star())
          .from(usersTable)
          .toQuery();
      } else {
        var _query = usersTable
          .select(usersTable.star())
          .from(usersTable);
        // additinal query for each of the get params added as where
        for (var key in url_parts.query) {
            _query = _query.where(
              usersTable[key].equals(url_parts.query[key])
            );
        }
        _query = _query.toQuery();
      }      
      
           
      // run db connection
      var _api = new dbApi();
      _api.makeConnect();
      var _dbConn = _api.getConnection();
      // for case without params run simple query, and if params, pass values as 2nd arg.
      if ( _isEmpty() ) {
        _dbConn.query(_query.text, (err, rows, fields) => {
          if (err) throw err;
					_dbConn.end();
          callback(null, rows);  
        });   
      } else {
        _dbConn.query(_query.text, _query.values, (err, rows, fields) => {
          if (err) throw err;
					_dbConn.end();
          callback(null, rows);  
        }); 
      }         
    };
    
//    debug('dev')('items received', items);
    this.body = JSON.stringify(items);
  }
)