\!\[SQL Image\]\(https://www.tutorialrepublic.com/lib/images/sql-illustration.png\)

# About

**SQL Super** is a package which perform basic **SQL CRUD operations** without writing SQL queries.


#### Note

**SQL Super** can be used only for Postgres SQL. It is currently not available for mySQL.


# Installation

## Using npm:

```
$  npm install sql-super
```

Follow our installing guide for more information.

#  Features

*   Creates a database and a table.
*   Lists all the databases and tables.
*   Drops a database and a table.
*   Inserts a row into the table.
*   Reads data from the table.
*   Updates a row in the table.
*   Deletes a row from the table.

#   Quick Start Docs

##  Import

```
const sqlsuper = require("sql-super");
```

We will be covering all the basic CRUD operations that can be done using **sql-super**.
First of all, to perform any operation with a database we have to connect to the database.

## Connect to a Database

### sqlsuper.connect()  
  
This method takes five mandatory arguments and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| username | string |
| password | string |
| host | string |
| port | Number |
| database to be connected with | string |
| callback (Optional) | function |  
  
The callback function gets one parameter called "error", which gets the value of error, if the connection fails.

### Usage:

```
sqlsuper.connect("postgres","jaguar","localhost",5432,"test");
```

or

```
sqlsuper.connect("postgres","jaguar","localhost",5432,"test", function(error){
    if(error)
        console.error(error);
    else
        console.log("connected to Database successfully!.");
});
```

#   **C**RUD - CREATE

## Create Database

### sqlsuper.createDb()  
  
This method takes one mandatory argument of string datatype and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| database name | string |
| callback (optional) | function |  

### Usage:

```
sqlsuper.createDb("test");
```

Or

```
sqlsuper.createDb("test", function(error){
    if(error)
        console.error(error);
    else
    {
        console.log("Database created successfully");
        console.log("Make sure to connect to the newly created database!.");
    }
});
```

## Create Table

### sqlsuper.createTable()  
  
This method takes two mandatory arguments and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| table_details | object |
| callback (optional) | function |  
  
The table_details is a javascript object which has the name of the column as a key and datatype as a value.

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

### Usage:

```
let details = 
    {
        id: "int",
        name: "varchar(255)",
        address: "varchar(255)"
    }

sqlsuper.createTable( "sampletable" , details);
```

Or

```
let details = 
    {
        id: "int",
        name: "varchar(255)",
        address: "varchar(255)"
    }

sqlsuper.createTable( "sampletable" , details , function(error){
    if( error )
        console.error(error);
    else
        console.log("Table created successfully.");
});
```

## Insert Fully into a Table

### sqlsuper.insertFully()  
  
This method takes two mandatory arguments and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| data | array |
| callback (optional) | function |  
  
The data is an array of values to be inserted.  
**NOTE: The order of the data should exactly match the order in the table.**

### Usage:

```
sqlsuper.insertFully("sampletable",[1,"siva","Kallakurichi"]);
```

or

```
sqlsuper.insertFully("sampletable",[1,"siva","kallakurichi"], function(error){
    if(error)
        console.error(error);
    else
        console.log("Inserted into table successfully.");
});
```


##  Insert Few into a table

### sqlsuper.insertFew()  
  
This method takes two mandatory arguments and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| data | object |
| callback (optional) | function |  
  
The data is the javascript object that contains the values to be inserted, where keys are the column names and the values are the data to be inserted at those columns.

#### Usage:

```
let data = {
    name: "siva",
    address: "kky"
}

sqlsuper.insertFew("sampletable",data);
```

or

```
let data = {
    name: "siva",
    address: "kky"
}

sqlsuper.insertFew("sampletable", data, function(error){
    if(error)
        console.error(error);
    else
        console.log("Inserted into table successfully.");
});
```

#   C**R**UD - READ

##  List all the Databases

### sqlsuper.listAllDbs()  
  
This method returns an array of databases that are created by the user to the callback function.

**results - array of databases**

### Usage:

```
sqlsuper.listAllDbs( function(error, results) {
    if(error)
        console.error(error);
    else
        console.log(results);//["db1","db2","db3"]
});
```

##  List all the tables

### sqlsuper.listAllTables()  
  
This method returns an array of tables that are under the connected database to the callback function.

**results - array of tables**

### Usage:

```
sqlsuper.listAllTables(function(err,results){
    if(err)
        console.error(err);
    else    
        console.log(results);//["table1","table2"]
});
```

##  Read the rows in a table

### sqlsuper.select()  
  
This method takes only one mandatory argument, an optional condition and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| condition (optional) | string |
| callback | function |  
  
**results - array of rows**

When the condition parameter is not given, it returns all the rows from the table.

#### Example: 

``` SELECT * FROM TABLE;```

#### Usage:

```
sqlsuper.select( "sampletable", function(error,data){
    if(error)
        console.log(error);
    else
        console.log(data);
});
```
When the condition parameter is given, it returns the rows which match the condition.

#### Example: 
``` SELECT * FROM TABLE WHERE id<20;```

```
sqlsuper.select( "sampletable", "id<20" , function(error,data){
    if(error)
        console.log(error);
    else
        console.log(data);
});
```

**NOTE: When using a string for a condition use a single quote.**

#### Example:

``` const condition = "name='siva'"; ```

Many conditions can also be combined into a single string and can be passed.

#### Example: 

``` const condition = "Country='Germany' AND City='Berlin'"; ```

#   CR**U**D - UPDATE

##  Update rows in a table

### sqlsuper.update()  
  
This method takes two mandatory arguments, an optional condition and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| changes | object |
| condition (optional) | string |
| callback (optional) | function |  
  
The **changes** is the javascript object that contains the data to be updated where keys are the column names and the values are the data to be updated in those columns.

When the condition parameter is not given, all the rows will be updated.

#### Usage:

```
let changes = {
    name: "jaguar",
    address: "Chennai"
};

sqlsuper.update("sampletable", changes, function(error){
    if(error)
        console.error(error);
    else
        console.log("Updated succesfully.");
});
```

By specifying the condition parameter, only the matching row(s) will be updated.

```
let changes = {
    id: 12,
    address: "Chennai"
};

sqlsuper.update("sampletable", changes, "name='siva'",function(error){
    if(error)
        console.error(error);
    else
        console.log("Updated succesfully.");
});
```

**NOTE: When using a string for a condition use a single quote.**

#### Example:

``` const condition = "name='siva'"; ```

Many conditions can also be combined into a single string and can be passed.

#### Example: 

``` const condition = "Country='Germany' AND City='Berlin'"; ```


#   CRU**D** - DELETE

## Delete/Drop a Database  

### sqlsuper.dropDb()  
  
This method takes only one mandatory argument and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| db name | string |
| callback (optional) | function |  
  
**NOTE: The database to be deleted should not be the active connected database.**

#### Usage:

```
sqlsuper.dropDb("test");
```

OR

```
sqlsuper.dropDb("testDB", function(error){
    if(error)
        console.error(error);
    else
        console.log("Database dropped successfully");
});
```

## Delete/Drop a Table

### sqlsuper.dropTable()

This method takes only one mandatory argument and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| callback (optional) | function |  
  
#### Usage:

```
sqlsuper.dropTable( "sampletable2" );
```

OR

```
sqlsuper.dropTable( "sampletable2" , function(error){
    if(error)
            console.error(error);
        else
        console.log("Table dropped successfully.");
} );
```

## Delete a Row

### sqlsuper.deleteRow()  
  
This method takes only one mandatory argument and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table_name | string |
| condition | string |
| callback (optional) | function |  
  
#### Usage:

When the condition is not specified, it deletes all the rows making the table empty.

```
sqlsuper.deleteRow("sampletable");
```

OR

```
sqlsuper.deleteRow("sampletable","name='siva'");
```

OR

```
sqlsuper.deleteRow("sampletable","name='siva'", function(error){
    if(error)
        console.error(error);
    else
        console.log("Deleted Successfully");
});
```

**NOTE: When using a string for a condition use a single quote.**

#### Example:

``` const condition = "name='siva'"; ```

Many conditions can also be combined into a single string and can be passed.

#### Example: 

``` const condition = "Country='Germany' AND City='Berlin'"; ```

---

#### Developed by [Siva Chandran](https://sivachandran.netlify.app/).