const { Client } = require("pg");
var client;

exports.connect = async function(userName,userPass,reqHost,reqPort,reqDatabase,callback)
{
    try 
    {
        if( typeof userName !== "string" || typeof userPass !== "string" || typeof reqPort !== "string" || typeof reqHost !== "string" || typeof reqDatabase !== "string" )
            console.log("Connection failed!. Too few arguments to connect to database");
        else
        {
            client = new Client( {
                user: userName,
                password: userPass,
                host: reqHost,
                port: reqPort,
                database: reqDatabase
            } );
            
            await client.connect();
            if(typeof callback === "function")
                callback(false);
        }
    } 
    catch (error) 
    {
        if(typeof callback === "function")
            callback(error); 
        else
            console.error(error);     
    }
}

// DATABASE FUNCTIONS

exports.listAllDbs = async function(callback){
    try 
    {
        const query = "SELECT datname FROM pg_database WHERE datistemplate = false;";
        var res = await client.query(query);
        rows = res.rows;
        const results = [];
        rows.forEach(function(name){
            results.push(name.datname);
        });
        if(typeof callback === "function")
            callback(false,results);    
    } 
    catch (error) 
    {
        if(typeof callback === "function")
            callback(error,false);
        else
            console.error(error); 
    }
    
}

exports.createDb = async function( dbName , callback){
    try 
    {
        if(typeof dbName !== "string")
            console.log("Data base name missing");
        else
        {
            const query = 'CREATE DATABASE \"' + dbName + '\";';
            await client.query(query);
            if(typeof callback === "function")
                callback(false);
        }
    } 
    catch (error) 
    {
        if(typeof callback === "function")
            callback(error);
        else
            console.error(error);
    }  
}

exports.dropDb = async function( dbName , callback){
    try 
    {
        if(dbName === undefined || typeof dbName === "function")
            console.log("Data base name missing");
        else
        {
            const query = 'DROP DATABASE \"' + dbName + '\";';
            await client.query(query);
            if(typeof callback === "function")
                callback(false);
        }
    } 
    catch (error) 
    {
        if(typeof callback === "function")
            callback(error);
        else
            console.error(error);
    }  
}

// TABLE FUNCTIONS

exports.createTable = async function( tableName , details , callback){
    try 
    {
        var query = 'CREATE TABLE \"' + tableName + '\" (';
        const keys = Object.keys(details);
        const values = Object.values(details);
        for(let i=0;i<keys.length; i++)
        {
            query += " " + keys[i] + " " + values[i] + ",";
            if(i === keys.length-1)
                query = query.slice(0,-1) + ' );'; 
        }
        await client.query(query);
        if(typeof callback === "function")
            callback(false); 
    } 
    catch (error) 
    {
        if(typeof callback === "function")
            callback(error); 
        else
            console.error(error);
    }  
}

exports.listAllTables = async function( callback ){
    try 
    {
        const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;";
        var res = await client.query(query);
        rows = res.rows;
        const results = [];
        rows.forEach(function(name){
            results.push(name.table_name);
        });
        if(typeof callback === "function")
            callback(false,results); 
    } 
    catch (error) 
    {
        if(typeof callback === "function")
            callback(error); 
        else
            console.error(error);
    }
}

exports.dropTable = async function( tableName , callback){
    try 
    {
        if( tableName === undefined || tableName === "" || typeof tableName === "function" )
            console.log("Table name missing.");
        else
        {
            const query = 'DROP TABLE \"' + tableName + '\";';
            await client.query(query);
            if(typeof callback === "function")
                callback(false); 
        }
    } 
    catch (error) 
    {
        if(typeof callback === "function")
            callback(error); 
        else
            console.error(error);
    }  
}

// READING DATA FROM A TABLE

exports.select = async function( tableName , condition , callback ){
    try
    {   
        if( tableName === undefined || tableName === "" || typeof tableName === "function")
            console.log("Table Name Missing!..");
        else if(typeof condition === "function")
        {
            const query = "SELECT * FROM \"" + tableName + "\";";
            var results = await client.query(query);
            results = results.rows;
            condition(false,results);
        }
        else if(typeof callback === "function")
        {
            const query = "SELECT * FROM \"" + tableName + "\" WHERE " + condition + ";";
            var results = await client.query(query);
            results = results.rows;
            callback(false,results); 
        }
        else
            console.log("Error! Read the documentation and try again.");
    }
    catch (error) 
    {
        if(typeof condition === "function")
            condition(error);
        else if(typeof callback === "function")
            callback(error);
        else
            console.error(error);
    }
};

// INSERTING DATA INTO A TABLE

exports.insertFully = async function(tableName,data,callback){
    try {
        if(typeof tableName !== "string")
            console.log("Table name missing.")
        else if(data === undefined || typeof data === "function")
            console.log("data to be inserted missing");
        else
        {
            var query = "INSERT INTO " + tableName + " VALUES("
            for(let i=0; i<data.length; i++ )
            {
                query += " $" + (i+1) +",";
                if(i === datas.length-1)
                    query = query.slice(0,-1) + ' );';              
            }
            await client.query(query,data);
            if(typeof callback === "function") 
                callback(false);
        }
    }
    catch (error) 
    {
        if(typeof callback === "function")
            callback(error);
        else
            console.error(error);
    }
};

exports.insertFew = async function(tableName, data, callback)
{
    try 
    {
        if(typeof tableName !== "string")
            console.log("Table name missing.")
        else if( typeof data !== "object" )
            console.log("data to be inserted is wrong or missing.");
        else if(typeof data === "object")
        {
            const keys = Object.keys(datas);
            const values = Object.values(datas);
            var query = "INSERT INTO \"" + tableName + "\"("
            for(let i=0; i<keys.length; i++)
            {
                query += " \"" + keys[i] +"\",";
                if(i === keys.length-1)
                    query = query.slice(0,-1) + ' ) VALUES('; 
            }
            
            for(let i=0; i<keys.length; i++)
            {
                query += " $" + (i+1) +",";
                if(i === keys.length-1)
                    query = query.slice(0,-1) + ' );'; 
            }
            await client.query(query,values);
            if(typeof callback === "function") 
                callback(false);
        }
        else
            console.log("Error! Read the documentation and try again.");
    } 
    catch (error)
    {
        if(typeof callback === "function") 
            callback(error);
    }
};

// DELETING DATA FROM A TABLE

exports.deleteRow = async function(tableName, condition, callback){
    try 
    {
        if(typeof tableName !== "string")
            console.log("Table name missing.");
        else if( typeof condition !== "string" )
        {
            await client.query("DELETE FROM \"" + tableName + "\";");
            if(typeof condition === "function") 
                condition(false);
        }
        else if(typeof condition === "string")
        {
            const query = "DELETE FROM \"" + tableName + "\" WHERE " + condition + ";";
            await client.query(query);
            if(typeof condition === "function") 
                callback(false);
        }
        else
            console.log("Error! Read the documentation and try again.");
    }
    catch (error) 
    {
        if(typeof condition === "function")
            condition(error);
        else if(typeof callback === "function") 
            callback(error);
        else 
            console.error(error);
    }
};

exports.update = async function(tableName, changes, condition, callback){
    try
    {
        if(typeof tableName !== "string")
            console.log("Table name missing.");
        else if(typeof changes !== "object")
            console.log("Values to be Changed is wrong missing.");
        else if(typeof changes === "object")
        {
            var query = "UPDATE \""+ tableName + "\" SET";
            const keys = Object.keys(changes);
            const values = Object.values(changes);
            
            for(let i=0;i<keys.length; i++)
            {
                query += " " + keys[i] + " = \'" + values[i] + "\',";
                if(i === keys.length-1)
                    query = query.slice(0,-1) + ";"; 
            }
            
            if( typeof condition === "string" )
                query =  query.slice(0,-1) + " WHERE " + condition + ";"
            
            await client.query(query);
            
            if(typeof condition === "function") 
                condition(false);
            else if(typeof callback === "function")    
                callback(false);
        }
        else
            console.log("Error! Read the documentation and try again.");
    }
    catch (error) 
    {
        if(typeof condition === "function")
            condition(error);
        else if(typeof callback === "function") 
            callback(error);
        else 
            console.error(error);
    }
};