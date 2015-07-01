import mysql from 'mysql'
import debug from 'debug'

export default class dbApi {
  constructor() {
    this.dbconn = false;    
  }
  
  makeConnect() {
    if ( this.dbconn ) this.dbconn.end();
    this.dbconn = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
      database : 'fluxdb'
    });  
    this.dbconn.on('error', function(err) {
      debug('dev')(err);
    });
    this.dbconn.connect();
  }
  
  getConnection() {
    return this.dbconn;
  }
}