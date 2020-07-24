![SQL Image](https://www.tutorialrepublic.com/lib/images/sql-illustration.png)

#  Works for both mySQL and pgSQL.

# About Sql Super

**SQL Super** is a package which perform basic **SQL CRUD operations** without writing SQL queries.

# Installation

## Using npm:

```
$  npm install sql-super
```

Follow our installation guide for more information.

#  Features

*   Creates a connection.
*   Disconnects a connection. 
*   List all the databases.
*   Create a database.
*   Drop a database.
*   Use a database.
*   List all the tables.
*   Create a table.
*   Drop a table.
*   Insert one row into the table.
*   Insert many rows into the table.
*   Read data from the table.
*   Update a row in the table.
*   Delete a row from the table.

#   Quick Start Docs

##  How to import

```
const sqlsuper = require("sql-super");
```

We will be covering all the basic CRUD operations that can be done using **sql-super**.
First of all, to perform any operation with a database we have to connect to the database.

## Connection functions

*   connectMySQL()
*   disconnectMySQL()
*   connectPgSQLClient()
*   connectPgSQLPool()
*   disconnectPgSQL()

### sqlsuper.connectMySQL()  
  
This method is to connect to a mySQL Database. It takes four mandatory arguments and an optional callback function. This method returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| host | string |
| user | string |
| password | string |
| database | string |
| callback (Optional) | function |  
  
##### Promise based usage:

```
await sqlsuper.connectMySQL("host","your_username","your_password","database");
```

##### Callback based usage:

```
sqlsuper.connectMySQL("host","your_username","your_password","database", function(error){
    if(error)
        console.error(error);
    else
        console.log("connected to Database successfully!.");
});
```

### sqlsuper.disconnectMySQL()
  
This method is to disconnect from a mySQL Database. It take an optional callback function as argument and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| callback (Optional) | function |  

##### Promise based usage:

```
await sqlsuper.disconnectMySQL();
```

##### Callback based usage:

```
sqlsuper.disconnectMySQL( function(error) {
    if(error)
        console.error(error);
    else
        console.log("Disconnected to database successfully!.");
});
```

### sqlsuper.connectPgSQLClient()  
  
This method is to connect to a local pgSQL Database. It takes five mandatory arguments and an optional callback function and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| username | string |
| password | string |
| host | string |
| port | string |
| database | string |
| callback (Optional) | function |  
  
##### Promise based usage:

```
await sqlsuper.connectPgSQLClient("your_username","your_password","host","port","database");
```

##### Callback based usage:

```
sqlsuper.connectPgSQLClient("your_username","your_password","host","port","database", function(error){
    if(error)
        console.error(error);
    else
        console.log("connected to Database successfully!.");
});
```

### sqlsuper.connectPgSQLPool()  
  
This method is to connect to a pgSQL cloud Database. It takes connection string and an optional callback function as arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| connection_string | string |
| callback (Optional) | function |  
  
##### Promise based usage:

```
await sqlsuper.connectPgSQLPool("your_connection_string");
```

##### Callback based usage:

```
sqlsuper.connectPgSQLPool("your_connection_string", function(error){
    if(error)
        console.error(error);
    else
        console.log("connected to Database successfully!.");
});
```

### sqlsuper.disconnectPgSQL()
  
This method is to disconnect from a pgSQL Database. It take an optional callback function as argument and returns a promise. This method can be used for both connectPgSQLClient and connectPgSQLPool functions to disconnect.

| Parameter | Datatype |
| ----------- | ----------- |
| callback (Optional) | function |  

##### Promise based usage:

```
await sqlsuper.disconnectPgSQL();
```

##### Callback based usage:

```
sqlsuper.disconnectPgSQL( function(error){
    if(error)
        console.error(error);
    else
        console.log("Disconnected to database successfully!.");
});
```

## Database functions

*   listAllDbs()
*   createDb()
*   dropDb()
*   useDb()

### sqlsuper.listAllDbs()  
  
This method lists all the databases. It takes an optional callback function. This method returns an array as promise.

| Parameter | Datatype |
| ----------- | ----------- |
| callback (Optional) | function |  
  
##### Promise based usage:

```
const results = await sqlsuper.listAllDbs();
console.log(results);   // array of dbs
```

##### Callback based usage:

```
sqlsuper.listAllDbs( function(error,results){
    if(error)
        console.error(error);
    else
        console.log(results);   // array of dbs
});
```

### sqlsuper.createDb()  
  
This method creates a new database. It takes a string and an optional callback function as arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| database_name | string |  
| callback (Optional) | function |  
  
##### Promise based usage:

```
await sqlsuper.createDb("sample_db");
```

##### Callback based usage:

```
sqlsuper.createDb( "sample_db" , function(error){
    if(error)
        console.error(error);
    else
        console.log("Successfully created.");
});
```

### sqlsuper.dropDb()  
  
This method drops/deletes a database. It takes a string and an optional callback function as arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| database_name | string |
| callback (Optional) | function |  
  
##### Promise based usage:

```
await sqlsuper.dropDb("sample_db");
```

##### Callback based usage:

```
sqlsuper.dropDb( "sample_db",function(error){
    if(error)
        console.error(error);
    else
        console.log("Database dropped successfully.");
});
```

### sqlsuper.useDb()  
  
This method is to switch from one database to another database. It takes a string and an optional callback function as arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| database_name | string |
| callback (Optional) | function |  
  
##### Promise based usage:

```
await sqlsuper.useDb("test_db");
```

##### Callback based usage:

```
sqlsuper.useDb( function(error){
    if(error)
        console.error(error);
    else
        console.log("Database switched successfully.");
});
```

## Table functions

*   listAllTables()
*   createTable()
*   dropTable()

### sqlsuper.listAllTables()  
  
This method lists all the tables. It takes an optional callback function. This method returns an array as promise.

| Parameter | Datatype |
| ----------- | ----------- |
| callback (Optional) | function |  
  
##### Promise based usage:

```
const results = await sqlsuper.listAllTables();
console.log(results);   // array of tables
```

##### Callback based usage:

```
sqlsuper.listAllTables( function(error,results){
    if(error)
        console.error(error);
    else
        console.log(results);   // array of tables
});
```

### sqlsuper.createTable()  
  
This method creates a new table. It takes two mandatory arguments and an optional callback function. This method returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |  
| table_details | object |  
| callback (Optional) | function |  
  
The table_details is a javascript object which has the name of the column as a key and datatype as a value.
  
**Note:** The datatype which is given at value is always a string.

### Example:

```
CREATE TABLE Persons (
    ID int,
    name varchar(255),
    address varchar(255)
);
```

is similar to

```
let details = 
    {
        id: "int",
        name: "varchar(255)",
        address: "varchar(255)"
    }
```

##### Promise based usage:

```
let details = 
    {
        id: "int",
        name: "varchar(255)",
        address: "varchar(255)"
    }
await sqlsuper.createTable("sample_table",details);
```

##### Callback based usage:

```
let details = 
    {
        id: "int",
        name: "varchar(255)",
        address: "varchar(255)"
    }
sqlsuper.createTable( "sample_table" , details , function(error){
    if(error)
        console.error(error);
    else
        console.log("Successfully created.");
});
```

### sqlsuper.dropTable()  
  
This method drops/deletes a table. It takes a string and an optional callback function as arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| callback (Optional) | function |  
  
##### Promise based usage:

```
await sqlsuper.dropTable("sample_table");
```

##### Callback based usage:

```
sqlsuper.dropTable( "sample_table",function(error){
    if(error)
        console.error(error);
    else
        console.log("Table dropped successfully.");
});
```

## CRUD Operations

1) CREATE - CRUD OPERATIONS
* insertOne()
* insertOneFully()
* insertMany()

2) READ - CRUD OPERATION
* select()

3) UPDATE - CRUD OPERATION
* update()

4) DELETE - CRUD OPERATION
* deleteRow()

## CREATE - CRUD OPERATION

### sqlsuper.insertOne()
  
This method inserts a row to the table. It takes a string , an object and an optional callback function as arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| data | object |
| callback (optional) | function |  
  
The data is the javascript object that contains the values to be inserted, where keys are the column names and the values are the data to be inserted at those columns.
  
##### Promise based usage:

```
const data = {
    id: 1,
    name: "sivachandran"
};
await sqlsuper.insertOne("test_table",data);
// This is equal to INSERT INTO "test_table"(id,name) VALUES(1,'sivachandran');
```

##### Callback based usage:

```
const data = {
    id: 1,
    name: "sivachandran"
};
sqlsuper.insertOne("test_table" , data , function(error){
    if(error)
        console.error(error);
    else
        console.log("Inserted Successfully.");
});
```

### sqlsuper.insertOneFully()
  
This method inserts a complete row to the table. It takes a string , an array and an optional callback function as arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| data | array |
| callback (optional) | function |  
  
The data is an array of values to be inserted.
**NOTE: The order of the values in data array should exactly match the order of corresponding columns in the table.**
  
##### Promise based usage:

```
const data = [1,"siva","CHN"];
await sqlsuper.insertOneFully("test_table",data);
// This is equal to INSERT INTO "test_table" VALUES(1,'siva','CHN');
```

##### Callback based usage:

```
const data = [1,"siva","CHN"];

sqlsuper.insertOneFully("test_table" , data , function(error){
    if(error)
        console.error(error);
    else
        console.log("Inserted Successfully.");
});
```

### sqlsuper.insertMany()
  
This method inserts many rows into the table. It takes two mandatory arguments and two optional arguments and returns the number of rows inserted as a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| data | array of arrays |
| cols(optional) | array |
| callback (optional) | function |  
  
The data is an array of values array to be inserted. The cols is an array of column names where only the data are to be inserted. The column names must be specified as a string in the cols array.
**NOTE: In case cols array is not specified then the order of the values in data array should exactly match the order of corresponding columns in the table.**
  
##### Promise based usage:

The below code inserts fully complete rows into the table as the cols parameter was not specified.

```
const data = [
        [1,"siva","house"],
        [2,"chandran","home"],
        [3,"jaguar","address"],
        [4,"jey","address"]
    ];
await sqlsuper.insertMany( "test_table" , data );
```

OR

The below code inserts many rows but only at those specified columns into the table as the cols parameter was specified.

```
const data = [
        [1,"siva"],
        [2,"chandran"],
        [3,"jaguar"],
        [4,"jey"]
    ];
const cols = ["id","name"];
await sqlsuper.insertMany( "test_table" , data , cols );
```

##### Callback based usage:

The below code inserts fully complete rows into the table as the cols parameter was not specified.

```
const data = [
        [1,"siva","house"],
        [2,"chandran","home"],
        [3,"jaguar","address"],
        [4,"jey","address"]
    ];

sqlsuper.insertMany( "test_table" , data , function(error){
    if(error)
        console.error(error);
    else
        console.log("Inserted Successfully.");
});
```

```
const data = [
        [1,"siva"],
        [2,"chandran"],
        [3,"jaguar"],
        [4,"jey"]
    ];
const cols = ["id","name"];

sqlsuper.insertMany("test_table" , data , cols , function(error){
    if(error)
        console.error(error);
    else
        console.log("Inserted Successfully.");
});
```

## READ - CRUD OPERATION

### sqlsuper.select()
  
This method reads data from the table. It takes a mandatory string argument and two optional arguments and returns an array of rows as a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| conditions (optional) | string |
| callback (optional) | function |  
  
##### Promise based usage:

When the conditions parameter is not given, it returns all the rows from the table.

#### Example: 

``` SELECT * FROM "test_table";```

```
var results = await sqlsuper.select( "test_table" );
console.log(results);
```

**results - array of rows**

When the conditions parameter is given, it returns only the rows that match the conditions from the table.

``` SELECT * FROM "test_table" WHERE id=4;```

```
var results = await sqlsuper.select( "test_table" , "id=4" );
console.log(results);
```

##### Callback based usage:

When the conditions parameter is not given, it returns all the rows from the table.

```
sqlsuper.select( "test_table" , function(error,results){
    if(error)
        console.error(error);
    else
        console.log("results");
});
```

When the conditions parameter is given, it returns only the rows that match the conditions from the table.

```
sqlsuper.select( "test_table" , "id=4" , function(error,results){
    if(error)
        console.error(error);
    else
        console.log("results");
});
```

**NOTE: When using a string for a condition use a single quote.**

##### Example:

``` let condition = "name='siva'"; ```

Many conditions can also be combined into a single string and can be passed.

##### Example: 

``` let condition = "Country='Germany' AND City='Berlin'"; ```


## UPDATE - CRUD OPERATION

### sqlsuper.update()
  
This method updates new data to the table. It takes two mandatory arguments, two optional arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| data | object |
| conditions (optional) | string |
| callback (optional) | function |  

The **data** is the javascript object that contains the data to be updated where keys are the column names and the values are the data to be updated in those columns.
  
##### Promise based usage:

When the conditions parameter is not given, it updates all the rows from the table.

```
const data = {
    id: 2,
    name: "jaguar"
}

await sqlsuper.update( "test_table" , data );  
```

When the conditions parameter is given, it updates only the rows that match the conditions from the table.

``` 
const data = {
    id: 2,
    name: "jaguar"
}

await sqlsuper.update( "test_table" , data , "id=4" );    
```

##### Callback based usage:

When the conditions parameter is not given, it updates all the rows from the table.

```
const data = {
    id: 2,
    name: "jaguar"
}

sqlsuper.update( "test_table" , data , function(error){
    if(error)
        console.log(error);
    else
        console.log("updated successfully.");
});  
```

When the conditions parameter is given, it updates only the rows that match the conditions from the table.

``` 
const data = {
    id: 2,
    name: "jaguar"
}

sqlsuper.update( "test_table" , data , "id=4" , function(error){
    if(error)
        console.log(error);
    else
        console.log("updated successfully.");
});    
```

**NOTE: When using a string for a condition use a single quote.**

##### Example:

``` let condition = "name='siva'"; ```

Many conditions can also be combined into a single string and can be passed.

##### Example: 

``` let condition = "Country='Germany' AND City='Berlin'"; ```


## DELETE - CRUD OPERATION

### sqlsuper.deleteRow()
  
This method deletes row(s) from the table. It takes a mandatory string argument , two optional arguments and returns a promise.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| conditions (optional) | string |
| callback (optional) | function |  
  
##### Promise based usage:

When the conditions parameter is not given, it deletes all the rows from the table.

```
await sqlsuper.deleteRow( "test_table" );  
```

When the conditions parameter is given, it deletes only the rows that match the conditions from the table.

```
await sqlsuper.deleteRow( "test_table" , "id=4" );    
```

##### Callback based usage:

When the conditions parameter is not given, it deletes all the rows from the table.

```
sqlsuper.deleteRow( "test_table" , function(error){
    if(error)
        console.log(error);
    else
        console.log("deleted successfully.");
});  
```

When the conditions parameter is given, it deletes only the rows that match the conditions from the table.

``` 
sqlsuper.deleteRow( "test_table" , "id=4" , function(error){
    if(error)
        console.log(error);
    else
        console.log("deleted successfully.");
});    
```

**NOTE: When using a string for a condition use a single quote.**

##### Example:

``` let condition = "name='siva'"; ```

Many conditions can also be combined into a single string and can be passed.

##### Example: 

``` let condition = "Country='Germany' AND City='Berlin'"; ```



---

#### Developed by [Siva Chandran](https://sivachandran.netlify.app/).