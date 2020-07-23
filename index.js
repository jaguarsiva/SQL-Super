const mysql = require("mysql");
const { Client , Pool } = require("pg");
var connection;
var credentials = {};
var client;
var mySQL = false;
var pgSQL = false;

//  MYSQL CONNECTION FUNCTIONS

exports.connectMySQL = function ( HOST , USER , PASSWORD , DATABASE , callback) {
    function connectMySQLPromise( resolve,reject ){
        if( typeof HOST !== "string" || typeof USER !== "string" || typeof PASSWORD !== "string" || typeof DATABASE !== "string" )
        {
            const err = {
                status: "Failed",
                message : "Connection failed!. Error in arguments."
            }
            reject( err );
            if(typeof HOST === "function")
                HOST(err);
            else if(typeof USER === "function")
                USER(err);
            else if(typeof PASSWORD === "function")
                PASSWORD(err);
            else if(typeof DATABASE === "function")
                DATABASE(err);
            else if(typeof callback === "function")
                callback(err);
        }
        else
        {
            connection = mysql.createConnection({
                host     : HOST,
                user     : USER,
                password : PASSWORD,
                database : DATABASE
            });

            connection.connect();
            const msg = {
                status: "success",
                message: "connected to " + DATABASE + " Successfully."
            };
            mySQL = true;
            resolve(msg);
            if(typeof callback === "function")
                callback(false,msg);
        }
    };

    return new Promise( connectMySQLPromise );
};

exports.disconnectMySQL = function(callback){

    function endConnectionPromise( resolve, reject ){
        connection.end( error => {
            if(error)
            {
                reject(error);
                if(typeof callback === "function")
                    callback( error );
            }
            else
            {
                const msg = {
                    status: "success",
                    message: "Connection ended successfully."
                };
                mySQL = false;
                resolve(msg);
                if(typeof callback === "function")
                    callback( false , msg );
            }
        });
    };
    return new Promise( endConnectionPromise );
};

//  PGSQL CONNECTION FUNCTIONS

exports.connectPgSQLClient = function( USERNAME , PASSWORD , HOST , PORT , DATABASE , callback ){
    async function connectPgSQLClientPromise (resolve,reject)
    {
        if( typeof USERNAME !== "string" || typeof PASSWORD !== "string" || typeof PORT !== "string" || typeof HOST !== "string" || typeof DATABASE !== "string" )
        {
            const err = {
                status: "Failed",
                message : "Connection failed!. Error in arguments."
            }
            reject( err );
            if( typeof USERNAME === "function")
                USERNAME(err);
            else if( typeof PASSWORD === "function")
                PASSWORD(err);
            else if( typeof PORT === "function")
                PORT(err);
            else if( typeof HOST === "function")
                HOST(err);
            else if( typeof DATABASE === "function")
                DATABASE(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            credentials = {
                username: USERNAME,
                password: PASSWORD,
                host: HOST,
                port: PORT
            }

            client = new Client({
                user: USERNAME,
                password: PASSWORD,
                host: HOST,
                port: PORT,
                database: DATABASE
            });
            
            try 
            {
                await client.connect();
                const msg = {
                    status: "success",
                    message: "connected to " + DATABASE + " Successfully."
                };
                pgSQL = true;
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);
            } 
            catch (error) 
            {
                reject(error);
                if(typeof callback === "function")
                    callback(error,false);
            }
        }
    };
    
    return new Promise( connectPgSQLClientPromise );
};

exports.connectPgSQLPool = function ( connString , callback ){

    async function connectPgSQLPoolPromise(resolve,reject)
    {
        if( typeof connString !== "string" )
        {
            const err = {
                status: "Failed",
                message: "Connection Failed. Connection string missing or not a string."
            }
            reject(err);
            if(typeof connString === "function")
                connString(err,false);
            else if(typeof callback === "function")
                callback(err,false);
        }
        else
        {
            const pool = new Pool({
                connectionString: connString,
                ssl: {
                  rejectUnauthorized: false
                }
              });
              
              try 
              {
                  client =await pool.connect();
                  const msg = {
                      status: "success",
                      message: "connected Successfully."
                  };
                  pgSQL = true;
                  resolve(msg);
                  if(typeof callback === "function")
                      callback(false,msg);
              } 
              catch (error) 
              {
                  reject(error);
                  if(typeof callback === "function")
                      callback(error,false);
              }
        }
    }

    return new Promise( connectPgSQLPoolPromise );
};

exports.disconnectPgSQL = function( callback ){
    async function disconnectPgSQLPromise(resolve,reject)
    {
        try 
        {
            await client.end();
            const msg = {
                status: "Success",
                message: "Connection ended successfully."
            }
            pgSQL = false;
            resolve(msg);
            if(typeof callback === "function")
                callback(false,msg);
        } 
        catch (error) 
        {
            reject(error);
            if(typeof callback === "function")
                callback(error,false); 
        }
    };

    return new Promise( disconnectPgSQLPromise );
};

//  DATABASE FUNCTIONS

exports.listAllDbs = function ( callback ) {

    function MySQLlistAllDbsPromise(resolve , reject){
        connection.query("SHOW DATABASES", function (error,results){
            if(error)
            {
                reject( error );
                if(typeof callback === "function")
                    callback(error,false);
            }
            else
            {
                const dbs = results.map( db => db.Database);
                resolve(dbs);
                if(typeof callback === "function")
                    callback( false , dbs );
            }
        })
    };
    
    async function PgSQLlistAllDbsPromise( resolve , reject ){
        try 
        {
            const query = "SELECT datname FROM pg_database WHERE datistemplate = false;";
            var { rows } = await client.query(query);
            rows = rows.map ( db => db.datname);
            resolve(rows);
            if(typeof callback === "function")
                callback( false , rows );    
        } 
        catch (error) 
        {
            reject(error);
            if( typeof callback === "function" )
                callback( error , false );
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( PgSQLlistAllDbsPromise );
    else if( mySQL && !pgSQL )
        return new Promise( MySQLlistAllDbsPromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

exports.createDb = function ( DBNAME , callback )
{
    function MySQLcreateDbPromise( resolve , reject ){
        if( typeof DBNAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in DBNAME.  Database name not provided or not a string."
            };
            reject( err );
            if( typeof DBNAME === "function")
                DBNAME(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            const query = "CREATE DATABASE " + DBNAME + ";"; 
            connection.query( query, error => {
                if( error )
                {
                    reject( error );
                    if(typeof callback === "function" )
                        callback(error);
                }
                else 
                {
                    const msg = {
                        status: "success",
                        message: DBNAME + " database created successfully."
                    };
                    resolve(msg);
                    if(typeof callback === "function")
                        callback(false,msg);
                }
            });
        }
    }

    async function PgSQLcreateDbPromise( resolve , reject )
    {
        if(typeof DBNAME !== "string")
        {
            const err = {
                status: "failed",
                message: "Error in DBNAME.  Database name not provided or not a string."
            };
            reject( err );
            if( typeof DBNAME === "function")
                DBNAME(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            const query = 'CREATE DATABASE \"' + DBNAME + '\";';
            try 
            {
                await client.query(query);
                const msg = {
                    status: "success",
                    message: DBNAME + " database created successfully."
                };
                resolve(msg);
                if(typeof callback === "function")
                    callback( false , msg );
            } 
            catch (error) 
            {
                reject( error );
                if(typeof callback === "function" )
                    callback(error);
            }
        }
    };

    if( pgSQL && !mySQL )
        return new Promise( PgSQLcreateDbPromise );
    else if( !pgSQL && mySQL )
        return new Promise( MySQLcreateDbPromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

exports.dropDb = function ( DBNAME , callback ) {
    function mySQLdropDbPromise( resolve , reject ){
        if( typeof DBNAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in DBNAME.  Database name not provided or not a string."
            };
            reject( err );
            if( typeof DBNAME === "function")
                DBNAME(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            const query = "DROP DATABASE " + DBNAME + ";"; 
            connection.query( query, error => {
                if( error )
                {
                    reject( error );
                    if(typeof callback === "function" )
                        callback(error);
                }
                else 
                {
                    const msg = {
                        status: "success",
                        message: DBNAME + " Database deleted successfully."
                    };
                    resolve(msg);
                    if(typeof callback === "function")
                        callback(false,msg);
                }
            });
        }
    }

    async function pgSQLdropDbPromise(resolve,reject)
    {
        if( typeof DBNAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in DBNAME.  Database name not provided or not a string."
            };
            reject( err );
            if( typeof DBNAME === "function")
                DBNAME(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            try 
            {
                const query = 'DROP DATABASE \"' + DBNAME + '\";';
                await client.query(query);
                const msg = {
                    status: "success",
                    message: DBNAME + " Database deleted successfully."
                };
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);   
            } 
            catch (error) 
            {
                reject( error );
                if(typeof callback === "function" )
                    callback(error);
            }
        }    
    };

    if( pgSQL && !mySQL )
        return new Promise( pgSQLdropDbPromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLdropDbPromise);
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

exports.useDb = function ( DBNAME , callback ) {
    function mySQLuseDbPromise( resolve , reject ){
        if( typeof DBNAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in DBNAME.  Database name not provided or not a string."
            };
            reject( err );
            if( typeof DBNAME === "function")
                DBNAME(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            const query = "USE " + DBNAME + ";"; 
            connection.query( query, error => {
                if( error )
                {
                    reject( error );
                    if(typeof callback === "function" )
                        callback(error);
                }
                else 
                {
                    const msg = {
                        status: "success",
                        message: "Switched to " + DBNAME + " Database successfully."
                    };
                    resolve(msg);
                    if(typeof callback === "function")
                        callback(false,msg);
                }
            });
        }
    }

    async function pgSQLuseDbPromise(resolve,reject){
        if( typeof DBNAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in DBNAME.  Database name not provided or not a string."
            };
            reject( err );
            if( typeof DBNAME === "function")
                DBNAME(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            try 
            {
                await client.end();
                client = new Client({
                    user: credentials.username,
                    password: credentials.password,
                    host: credentials.host,
                    port: credentials.port,
                    database: DBNAME
                });
                await client.connect();
                const msg = {
                    status: "success",
                    message: "Switched to " + DBNAME + " database successfully."
                };
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);   
            } 
            catch (error) 
            {
                reject( error );
                if(typeof callback === "function" )
                    callback(error);
            }
        }
    }
    
    if( pgSQL && !mySQL )
        return new Promise( pgSQLuseDbPromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLuseDbPromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

//  TABLE FUNCTIONS

exports.listAllTables = function ( callback ) {
    
    function mySQLlistAllTablesPromise( resolve , reject ){
        connection.query( "SHOW TABLES;", (error,results) => {
            if( error )
            {
                reject( error );
                if(typeof callback === "function" )
                    callback(error);
            }
            else 
            {
                results = results.map( table => Object.values(table)[0] );
                resolve( results );
                if(typeof callback === "function")
                    callback( results );
            }
        });
    }

    async function pgSQLlistAllTablesPromise(resolve,reject)
    {
        try 
        {
            const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;";
            var { rows } = await client.query(query);
            rows = rows.map( table => table.table_name );
            resolve(rows);
            if(typeof callback === "function")
                callback(false,rows);
        }
        catch (error) 
        {
            reject(error);
            if(typeof callback === "function")
                callback(error);
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( pgSQLlistAllTablesPromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLlistAllTablesPromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

exports.createTable = function ( TABLENAME , details , callback ) {

    function mySQLcreateTablePromise( resolve , reject ){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in TABLENAME. Table name not provided or not a string."
            };
            reject( err );
            if( typeof TABLENAME === "function")
                TABLENAME(err);
            else if( typeof details === "function")
                details(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else if( typeof details !== "object" )
        {
            const err = {
                status: "failed",
                message: "Error in TABLE DETAILS. Table details not provided or not a valid object."
            };
            reject( err );
            if( typeof details === "function")
                details(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            var query = 'CREATE TABLE ' + TABLENAME + ' (';
            Object.keys(details).forEach( (key,i) => query += " " + key + " " + Object.values(details)[i] + "," );
            query = query.slice(0,-1) + ' );'; 
            connection.query( query, error => {
                if( error )
                {
                    reject( error );
                    if(typeof callback === "function" )
                        callback(error);
                }
                else
                {
                    const msg = {
                        status: "success",
                        message: "Table " + TABLENAME + " created successfully."
                    };
                    resolve(msg);
                    if(typeof callback === "function")
                        callback(false,msg);
                }
            });
        }
    }

    async function pgSQLcreateTablePromise(resolve,reject){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in TABLENAME. Table name not provided or not a string."
            };
            reject( err );
            if( typeof TABLENAME === "function")
                TABLENAME(err);
            else if( typeof details === "function")
                details(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else if( typeof details !== "object" )
        {
            const err = {
                status: "failed",
                message: "Error in TABLE DETAILS. Table details not provided or not a valid object."
            };
            reject( err );
            if( typeof details === "function")
                details(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            var query = 'CREATE TABLE \"' + TABLENAME + '\" (';
            Object.keys(details).forEach( (key,i) => query += " " + key + " " + Object.values(details)[i] + "," );
            query = query.slice(0,-1) + ' );';
            try 
            {
                await client.query(query);
                const msg = {
                    status: "success",
                    message: "Table created successfully."
                }
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);
            } 
            catch (error) 
            {
                reject(error)
                if(typeof callback === "function")
                    callback(error);
            }
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( pgSQLcreateTablePromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLcreateTablePromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

exports.dropTable = function ( TABLENAME , callback ) {
    function mySQLdropTablePromise( resolve , reject ){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in TABLENAME. Table name not provided or not a string."
            };
            reject( err );
            if( typeof TABLENAME === "function")
                TABLENAME(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            const query = "DROP TABLE " + TABLENAME + ";"; 
            connection.query( query, error => {
                if( error )
                {
                    reject( error );
                    if(typeof callback === "function" )
                        callback(error);
                }
                else 
                {
                    const msg = {
                        status: "success",
                        message: TABLENAME + " Table deleted successfully."
                    };
                    resolve(msg);
                    if(typeof callback === "function")
                        callback(false,msg);
                }
            });
        }
    }

    async function pgSQLdropTablePromise(resolve,reject)
    {
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Error in TABLENAME. Table name not provided or not a string."
            };
            reject( err );
            if( typeof TABLENAME === "function")
                TABLENAME(err);
            else if( typeof callback === "function")
                callback(err);
        }
        else
        {
            try 
            {
                await client.query( 'DROP TABLE \"' + TABLENAME + '\";' );
                const msg = {
                    status: "success",
                    message: "Table dropped successfully."
                }
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);
            } 
            catch (error) 
            {
                reject(error)
                if(typeof callback === "function")
                    callback(error);
            }
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( pgSQLdropTablePromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLdropTablePromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

//  1) CREATE - CRUD OPERATIONS

exports.insertOne = function ( TABLENAME , data , callback ){
    function mySQLinsertOnePromise(resolve , reject){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            reject( err );
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else if( typeof data !== "object" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Data to be inserted missing or invalid."
            }
            reject( err );
            if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else
        {
            var query = "INSERT INTO " + TABLENAME + " (";
            Object.keys(data).forEach( key => query += " " + key + " ," );
            query = query.slice(0,-1) + ') VALUES (';
            Object.values(data).forEach( val => {
                if(typeof val === "string")
                    query += " \'" + val +"\' ,";
                else
                    query += " " + val +" ,";
            });
            query = query.slice(0,-1) + ');';
            connection.query( query , error => {
                if(error)
                {
                    reject( error );
                    if(typeof callback === "function")
                        callback( error );
                } 
                else
                {
                    const msg = {
                        status: "success",
                        message: "Inserted Successfully."
                    };
                    resolve(msg);
                    if(typeof callback === "function")
                        callback(false,msg);
                }   
            });
        }
    };

    async function pgSQLinsertOnePromise(resolve,reject)
    {
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            reject( err );
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else if(typeof data !== "object")
        {
            const err = {
                status: "failed",
                message: "Ooops!. Data to be inserted missing or invalid."
            }
            reject( err );
            if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else
        {
            var query = "INSERT INTO " + TABLENAME + " (";
            Object.keys(data).forEach( key => query += " " + key + " ," );
            query = query.slice(0,-1) + ') VALUES (';              
            Object.keys(data).forEach( (k,i) => query += " $" + (i+1) + " ," );
            query = query.slice(0,-1) + ');';              
            try
            {
                await client.query(query,Object.values(data));
                const msg = {
                    status: "success",
                    message: "Inserted successfully."
                };
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);
            } 
            catch (error) 
            {
                reject(error)
                if(typeof callback === "function")
                    callback(error);
            }
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( pgSQLinsertOnePromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLinsertOnePromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

exports.insertOneFully = function ( TABLENAME , data , callback ){
    function mySQLinsertOneFullPromise(resolve , reject){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            reject( err );
            if( typeof TABLENAME === "function" )
                TABLENAME( err );
            else if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else if( typeof data !== "object" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Data to be inserted missing or invalid."
            }
            reject( err );
            if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else
        {
            var query = "INSERT INTO " + TABLENAME + " VALUES(";
            data.forEach( val => {
                if( typeof val === "string" )
                    query += " \'" + val +"\' ,";
                else
                    query += " " + val +" ,";
            });
            query = query.slice(0,-1) + ');';
            connection.query( query , error => {
                if(error)
                {
                    reject( error );
                    if(typeof callback === "function")
                        callback( error );
                } 
                else
                {
                    const msg = {
                        status: "success",
                        message: "Inserted Successfully."
                    };
                    resolve(msg);
                    if(typeof callback === "function")
                        callback(false,msg);
                }
            });
        }
    };

    async function pgSQLinsertOneFullyPromise(resolve,reject)
    {
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            reject( err );
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else if(typeof data !== "object")
        {
            const err = {
                status: "failed",
                message: "Ooops!. Data to be inserted missing or invalid."
            }
            reject( err );
            if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else
        {
            var query = "INSERT INTO " + TABLENAME + " VALUES (";
            data.forEach( (k,i) => query += " $" + (i+1) + " ," );
            query = query.slice(0,-1) + ');';     
            try
            {
                const {rowCount} = await client.query(query,data);
                const msg = {
                    status: "success",
                    message: "Inserted " + rowCount + " row successfully."
                };
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);
            } 
            catch (error) 
            {
                reject(error)
                if(typeof callback === "function")
                    callback(error);
            }
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( pgSQLinsertOneFullyPromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLinsertOneFullPromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

exports.insertMany = function ( TABLENAME , data , cols , callback ){
    function mySQLinsertManyPromise(resolve , reject){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            reject( err );
            if( typeof TABLENAME === "function" )
                TABLENAME( err );
            else if( typeof data === "function" )
                data( err );
            else if( typeof cols === "function" )
                cols( err );
            else if( typeof callback === "function" )
                callback( err );
        }
        else if( typeof data !== "object" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Data to be inserted missing or invalid."
            }
            reject( err );
            if( typeof data === "function" )
                data( err );
            else if( typeof cols === "function" )
                cols( err );
            else if( typeof callback === "function" )
                callback( err );
        }
        else if( typeof cols !== "object" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Array of column names missing or invalid."
            }
            reject( err );
            if( typeof cols === "function" )
                cols( err );
            else if( typeof callback === "function" )
                callback( err );
        }
        else
        {
            var query = "INSERT INTO " + TABLENAME + " (";
            cols.forEach( col => query += " " + col +" ," );
            query = query.slice(0,-1) + ') VALUES ?';
            connection.query( query , [data] , (error,results) => {
                if(error)
                {
                    reject( error );
                    if(typeof callback === "function")
                        callback( error );
                } 
                else
                {
                    const msg = {
                        status: "success",
                        message: "Inserted " + results.affectedRows + " rows Successfully."
                    };
                    resolve(msg);
                    if(typeof callback === "function")
                        callback(false,msg);
                }
            });
        }
    };

    async function pgSQLinsertManyPromise(resolve,reject)
    {
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            reject( err );
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else if(typeof data !== "object")
        {
            const err = {
                status: "failed",
                message: "Ooops!. Data to be inserted missing or invalid."
            }
            reject( err );
            if(typeof data === "function")
                data( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else
        {
            var query = "INSERT INTO " + TABLENAME;
            if( typeof cols === "object" )
            {
                query += " (";
                cols.forEach( col => query += " \"" + col + "\" ," );
                query = query.slice(0,-1) + ')';
            }
            query += " VALUES";
            var total = [];
            var count = 0;
            data.forEach(entry => {
                total = [...total , ...entry]
                query += " (";
                entry.forEach( c => query += " $" + ++count + " ," );
                query = query.slice(0,-1) + ') ,';
            });
            query = query.slice(0,-2) + ';';
            try
            {
                const {rowCount} = await client.query(query,total);
                const msg = {
                    status: "success",
                    message: "Inserted " + rowCount + " row successfully."
                };
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);
            } 
            catch (error) 
            {
                reject(error)
                if(typeof callback === "function")
                    callback(error);
            }
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( pgSQLinsertManyPromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLinsertManyPromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
        
};

//  2) READ - CRUD OPERATION

exports.select = function ( TABLENAME , conditions , callback ){
    function mySQLselectPromise(resolve,reject){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "Failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof conditions === "function")
                conditions( err );
            else if(typeof callback === "function")
                callback( err );
            reject( err );
        }
        else
        {
            var query = "SELECT * FROM " + TABLENAME + ";";
            if(typeof conditions === "string")
                query = query.slice(0,-1) + " WHERE " + conditions + ";"
            connection.query( query , ( error , results ) => {
                if(error)
                {
                    if(typeof conditions === "function")
                        conditions( error );
                    else if(typeof callback === "function")
                        callback( error );
                    reject( error );
                } 
                else
                {
                    results = results.map( obj => {
                        var res = {};
                        Object.keys(obj).forEach( (key,i) => res = { ...res , [key]: Object.values(obj)[i] } );
                        return res;
                    });
                    resolve(results);
                    if(typeof conditions === "function")
                        conditions( false , results );
                    else if(typeof callback === "function")
                        callback( false , results );
                }
            });
        }
    }

    async function pgSQLselectPromise(resolve,reject){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "Failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof conditions === "function")
                conditions( err );
            else if(typeof callback === "function")
                callback( err );
            reject( err );
        }
        else
        {
            var query = "SELECT * FROM " + TABLENAME + ";";
            if(typeof conditions === "string")
                query = query.slice(0,-1) + " WHERE " + conditions + ";"
            try 
            {
                const {rows} = await client.query(query);
                resolve(rows);
                if(typeof conditions === "function")
                    conditions( false , rows );
                else if(typeof callback === "function")
                    callback( false , rows );
            }
            catch (error)
            {
                reject(error)
                if(typeof conditions === "function")
                    conditions( error );
                else if(typeof callback === "function")
                    callback( error );
            }
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( mySQLselectPromise );
    else if( !pgSQL && mySQL )
        return new Promise( pgSQLselectPromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

//  3) UPDATE - CRUD OPERATION

exports.update = function ( TABLENAME , data , conditions ,  callback ){
    function mySQLupdatePromise(resolve,reject){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "Failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            reject( err );
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof data === "function")
                data( err );
            else if(typeof conditions === "function")
                conditions( err );
            else if(typeof callback === "function")
                callback( err );
        }
        else if(typeof data !== "object")
        {
            const err = {
                status: "Failed",
                message: "Ooops!. Data to be updated missing or may not be a object."
            }
            if(typeof data === "function")
                data( err );
            else if(typeof conditions === "function")
                conditions( err );
            else if(typeof callback === "function")
                callback( err );
            reject( err );
        }
        else
        {
            var query = "UPDATE " + TABLENAME + " SET";
            const keys = Object.keys(data);
            const values = Object.values(data);
            
            for(let i=0; i<keys.length; i++)
            {
                if(typeof values[i] === "string")
                    query += " " + keys[i] + " = \'" + values[i] + "\',";
                else
                    query += " " + keys[i] + " = " + values[i] + ",";
            }
            query = query.slice(0,-1) + ";"; 
            if(typeof conditions === "string")
                query = query.slice(0,-1) + " WHERE " + conditions + ";"

            connection.query( query , ( error , results ) => {
                if(error)
                {
                    if(typeof conditions === "function")
                        conditions( error );
                    else if(typeof callback === "function")
                        callback( error );
                    reject( error );
                } 
                else
                {
                    var msg = {
                        status: "success",
                        message: "Updated " + results.affectedRows + " rows successfully."
                    };
                    resolve( msg );
                    if(typeof conditions === "function")
                        conditions( false , msg );
                    else if(typeof callback === "function")
                        callback( false , msg );
                }
            });
        }
    }
    async function pgSQLupdatePromise( resolve , reject ){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "Failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof changes === "function")
                changes( err );
            else if(typeof conditions === "function")
                conditions( err );
            else if(typeof callback === "function")
                callback( err );
            reject( err );
        }
        else if( typeof changes !== "object" )
        {
            const err = {
                status: "Failed",
                message: "Ooops!. Changes to be made missing."
            }
            if( typeof changes === "function" )
                TABLENAME( err );
            else if( typeof conditions === "function" )
                conditions( err );
            else if( typeof callback === "function" )
                callback( err );
            reject( err );
        }
        else
        {
            var query = "UPDATE \""+ TABLENAME + "\" SET";
            Object.keys(changes).forEach( (key,i) => {
                query += " " + key + " = '";
                query += Object.values(changes)[i];
                query +=  "' ,";
            });
            query = query.slice(0,-1) + ";";
            
            if( typeof conditions === "string" )
                query =  query.slice(0,-1) + " WHERE " + conditions + ";"
            try            
            {
                const {rowCount} = await client.query( query );
                const msg = {
                    status: "success",
                    message: "Updated " + rowCount + " rows successfully."
                };
                resolve(msg);
                if(typeof conditions === "function")
                    conditions(false,msg);
                else if(typeof callback === "function")
                    callback(false,msg);
            } 
            catch (error) 
            {
                reject(error)
                if(typeof conditions === "function")
                    conditions(error);
                else if(typeof callback === "function")
                    callback(error);
            }
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( pgSQLupdatePromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLupdatePromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};

//  4) DELETE - CRUD OPERATION

exports.deleteRow = function ( TABLENAME , conditions , callback ){
    function mySQLdeleteRowPromise( resolve , reject ){
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "Failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof conditions === "function")
                conditions( err );
            else if(typeof callback === "function")
                callback( err );
            reject( err );
        }
        else
        {
            var query = "DELETE FROM " + TABLENAME + ";";
            if(typeof conditions === "string")
                query = query.slice(0,-1) + " WHERE " + conditions + ";"
            connection.query( query , ( error , results ) => {
                if(error)
                {
                    if(typeof conditions === "function")
                        conditions( error );
                    else if(typeof callback === "function")
                        callback( error );
                    reject( error );
                } 
                else
                {
                    var msg = {
                        status: "success",
                        message: "Deleted " + results.affectedRows + " rows successfully."
                    };
                    resolve( msg );
                    if(typeof conditions === "function")
                        conditions( false , msg );
                    else if(typeof callback === "function")
                        callback( false , msg );
                }
            });
        }
    }

    async function pgSQLdeleteRowPromise( resolve , reject )
    {
        if( typeof TABLENAME !== "string" )
        {
            const err = {
                status: "Failed",
                message: "Ooops!. Table name missing or may not be a String."
            }
            if(typeof TABLENAME === "function")
                TABLENAME( err );
            else if(typeof conditions === "function")
                conditions( err );
            else if(typeof callback === "function")
                callback( err );
            reject( err );
        }
        else
        {
            var query = "DELETE FROM \"" + TABLENAME + "\";";
            if( typeof conditions === "string" )
                query = query.slice(0,-1) + " WHERE " + conditions + ";";
            try 
            {
                const {rowCount} = await client.query(query);
                const msg = {
                    status: "success",
                    message: rowCount + " rows deleted successfully."
                };
                resolve(msg);
                if(typeof callback === "function")
                    callback(false,msg);
            } 
            catch (error) 
            {
                reject(error)
                if(typeof callback === "function")
                    callback(error);
            }
        }
    }

    if( pgSQL && !mySQL )
        return new Promise( pgSQLdeleteRowPromise );
    else if( !pgSQL && mySQL )
        return new Promise( mySQLdeleteRowPromise );
    else
        return new Promise( ( resolve , reject ) => {
            reject ( new Error("Error in connection..") );
        });
};