const MySql = require('mysql2');

const connection = MySql.createConnection( {
    
        host: "localhost",
        user: "root",
        password: "password",
        database: "hrtracking_db",
      },
      console.log("Server is Live")
    );
    
    module.exports = connection;
