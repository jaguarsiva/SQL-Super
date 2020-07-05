const { Client } = require("pg");

var client;

exports.connect = async function(userName,userPass,reqHost,reqPort,reqDatabase,callback)
{
    client = new Client({
        user: userName,
        password: userPass,
        host: reqHost,
        port: reqPort,
        database: reqDatabase
      })

    try {
        await client.connect();
        if(callback)    callback(false); 
    } catch (error) {
        if(callback)    callback(error); 
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
        if(callback) callback(false,results);    
    } 
    catch (error) 
    {
        if(callback) callback(error,false); 
    }
    
}

exports.createDb = async function( dbName , callback){
    try 
    {
        const query = 'CREATE DATABASE \"' + dbName + '\";';
        await client.query(query);
        if(callback) callback(false);  
    } 
    catch (error) 
    {
        if(callback) callback(error);
    }  
}

exports.dropDb = async function( dbName , callback){
    try 
    {
        const query = 'DROP DATABASE \"' + dbName + '\";';
        await client.query(query);
        if(callback) callback(false);
    } 
    catch (error) 
    {
        if(callback) callback(error);
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
        if(callback)    callback(false); 
    } 
    catch (error) 
    {
        console.error(error);
        if(callback)    callback(error); 
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
        if(callback)    callback(false,results); 
    } 
    catch (error) 
    {
        if(callback)    callback(error,false);
    }
}

exports.dropTable = async function( tableName , callback){
    try 
    {
        const query = 'DROP TABLE \"' + tableName + '\";';
        await client.query(query);
        if(callback)    callback(false); 
    } 
    catch (error) 
    {
        if(callback)    callback(error); 
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
        else
        {
            const query = "SELECT * FROM \"" + tableName + "\" WHERE " + condition + ";";
            var results = await client.query(query);
            results = results.rows;
            callback(false,results); 
        }
    }
    catch (error) 
    {
        if(typeof condition === "function") condition(error);
        else if(typeof callback === "function") callback(error);
        else console.log(error);
    }
};

// INSERTING DATA INTO A TABLE

exports.insertFully = async function(tableName,datas,callback){
    try {
        if(tableName === undefined || datas === undefined)
            console.log("tablename or datas missing.")
        else
        {
            var query = "INSERT INTO " + tableName + " VALUES("
            for(let i=0; i<datas.length; i++ )
            {
                query += " $" + (i+1) +",";
                if(i === datas.length-1)
                    query = query.slice(0,-1) + ' );';              
            }
            await client.query(query,datas);
            if(callback) callback(false);
        }
    } catch (error) {
        if(callback) callback(error);
    }
};


exports.insertFew = async function(tableName, datas, callback){
    try {
        if(tableName === undefined || datas === undefined)
            console.log("tablename or datas missing.")
        else
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
            if(callback) callback(false);
        }
    } 
    catch (error)
    {
        if(callback) callback(error);
    }
};

// DELETING DATA FROM A TABLE

exports.deleteRow = async function(tableName, condition, callback){
    try 
    {
        if(tableName === undefined || typeof tableName === "function")
            console.log("Table name missing.");
        else if( condition === undefined || typeof condition === "function" )
        {
            await client.query("DELETE FROM \"" + tableName + "\";");
            if(condition) condition(false);
        }
        else
        {
            const query = "DELETE FROM \"" + tableName + "\" WHERE " + condition + ";";
            await client.query(query);
            if(callback) callback(false);
        }
    }
    catch (error) 
    {
        if(typeof condition === "function") condition(error);
        else if(typeof callback === "function") callback(error);
        else console.log(error);
    }
};

exports.update = async function(tableName, changes, condition, callback){
    try
    {
        if(tableName === undefined || typeof tableName === "function")
            console.log("Table name missing.");
        else if(changes === undefined || typeof changes === "function")
            console.log("Changes required");
        else
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
            if(condition !== undefined && typeof condition !== "function")
                query =  query.slice(0,-1) + " WHERE " + condition + ";"
            await client.query(query);
            if(typeof condition === "function") condition(false);
            if(callback)    callback(false);
        }   
    }
    catch (error) 
    {
        if(callback)    callback(error);
    }
};