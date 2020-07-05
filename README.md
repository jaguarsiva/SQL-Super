[sql image](https://www.tutorialrepublic.com/lib/images/sql-illustration.png)

![PyPI](https://img.shields.io/pypi/v/1?color=blue&label=sql-super&logo=npm&style=flat-square)

# *About* 
---
Allergic to **Sql queries**! Dont worry! **sql-super** is there to help.
Perform basic **Sql CRUD operations** without writing SQL Queries.

# *Installation*
---
#### Using npm:
`$  npm install sql-super`

Follow our installing guide for more information.

# *Features*
---

*   Create a database , table
*   List all databases , tables
*   Drop a database , table
*   Insert into a table
*   Read from a table
*   Update a table row
*   Delete a row from a table

#   *Quick Start Docs*
---

###  Import
`const sqlsuper = require("sql-super");`
---


We will be covering all the basic CRUD operations that can be done using **sql-super**.
First of all to perform any operation with database , we have to connect to the database.

## Connect to a Database
___

Using **sqlsuper.connect()** function.
This method takes five mandatory arguments of string datatype, and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| username | string |
| password | string |
| host | string |
| port | string |
| database to be connected with | string |
| callback (Optional) | function |
The Callback function gets one parameter called error, which gets the value of error, If the Connection failed.

#### Usage:

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
---
Using **sqlsuper.createDb()** function.
This method takes one mandatory argument of string datatype, and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| database name | string |
| callback (optional) | function |

#### Usage:

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
---
Using **sqlsuper.createTable()** function.
This method takes two mandatory arguments, and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table name | string |
| table_details | object |
| callback (optional) | function |

table_details is a javascript object which has the name of the column as key and datatype as value

#### Example:
```
CREATE TABLE Persons (
    ID int,
    name varchar(255),
    address varchar(255)
);
```
is simailar to
```
let details = 
    {
        id: "int",
        name: "varchar(255)",
        address: "varchar(255)"
    }
```

#### Usage:

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
---
Using **sqlsuper.insertFully()** function.
This method takes two mandatory arguments, and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table name | string |
| data | array |
| callback (optional) | function |

data is the array of data to be inserted!
**NOTE: The order of the data should exactly match as those in table.**
#### Usage:
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


##  Insert Only Few into a table
---
Using **sqlsuper.insertFew()** function.
This method takes two mandatory arguments, and an optional callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table name | string |
| data | object |
| callback (optional) | function |

Datas is the javascript object that contains the datas to be inserted!
key is the column name.
values is the data to be inserted at that column.
#### Usage:
```
let datas = {
    name: "siva",
    address: "kky"
}

sqlsuper.insertFew("sampletable",datas);
```
or
```
let datas = {
    name: "siva",
    address: "kky"
}

sqlsuper.insertFew("sampletable", datas, function(error){
    if(error)
        console.error(error);
    else
        console.log("Inserted into table successfully.");
});
```
#   C**R**UD - READ

##  List all Databases
---
Using **sqlsuper.listAllDbs()** function.
This method returns the array of databases that are created by the user to the callback function.
**results - array of databases**
#### Usage:
```
sqlsuper.listAllDbs( function(error, results) {
    if(error)
        console.error(error);
    else
        console.log(results);//["db1","db2","db3"]
});
```

##  List all Tables
---
Using **sqlsuper.listAllTables()** function.
This method returns the array of Tables that are under the connected database to the callback function.
**results - array of tables**
#### Usage:
```
sqlsuper.listAllTables(function(err,results){
    if(err)
        console.error(err);
    else    
        console.log(results);//["table1","table2"]
});
```

##  Read rows in a table
---
Using **sqlsuper.select()** function.
This method takes one mandatory argument, and an optional condition and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table name | string |
| condition (optional) | string |
| callback | function |

**results - array of rows**
When the condition parameter is not given , it returns all the rows from the table.
Example: ``` SELECT * FROM TABLE;```
#### Usage:
```
sqlsuper.select( "sampletable", function(error,data){
    if(error)
        console.log(error);
    else
        console.log(data);
});
```
When the condition parameter is given , it returns the rows which matches the conditions.
Example: ``` SELECT * FROM TABLE WHERE id<20;```

```
sqlsuper.select( "sampletable", "id<20" , function(error,data){
    if(error)
        console.log(error);
    else
        console.log(data);
});
```
**NOTE: When using a string for a condition use a single quote**
Example: ``` const condition = "name='siva'"; ```
You can also combine many conditions into one string and pass it. 
Example: ``` const condition = "Country='Germany' AND City='Berlin'"; ```

#   CR**U**D - UPDATE
##  Update rows in a table
---
Using **sqlsuper.update()** function.
This method takes two mandatory arguments, and an optional condition and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table name | string |
| changes | object |
| condition (optional) | string |
| callback (optional) | function |

**changes** is the javascript object that contains the data to be updated!.
Keys are the column names.
Values are the data to be updated at that column.

When the condition parameter is not given, then all rows will be updated.
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

By Specifying the condition parameter , only the matching row(s) will be updated.
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
**NOTE: When using a string for conditions use a single quote**
Example: ``` const condition = "name='siva'"; ```
You can also combine many conditions into one string and pass it. 
Example: ``` const condition = "Country='Germany' AND City='Berlin'"; ```


#   CRU**D** - DELETE
## Delete/Drop a Database
---
Using **sqlsuper.dropDb()** function.
This method takes one mandatory argument and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| db name | string |
| callback (optional) | function |

**NOTE: The database going to be deleted should not be the active connected database.**
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
---
Using **sqlsuper.dropTable()** function.
This method takes one mandatory argument and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table name | string |
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
---
Using **sqlsuper.deleteRow()** function.
This method takes one mandatory argument and a callback function.

| Parameter | Datatype |
| ----------- | ----------- |
| table name | string |
| condition | string |
| callback (optional) | function |

#### Usage:
When the condition is not specified , it deleted all the rows , making the table empty.
```
sqlsuper.deleteRow("sampletable");
```

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
**NOTE: When using a string for conditions use a single quote**
Example: ``` const condition = "name='siva'"; ```
You can also combine many conditions into one string and pass it. 
Example: ``` const condition = "Country='Germany' AND City='Berlin'"; ```

---

# This package was developed by Siva Chandran.
## [Click here to view my Portfolio.](https://sivachandran.netlify.app/)