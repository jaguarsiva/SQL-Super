const sqlsuper = require("./index");

pgsql();

async function pgsql() {
    try 
    {
        await sqlsuper.connectPgSQLClient("postgres","jaguar","localhost","5432","sample");
        
        const changes = {
            id: 2,
            name: "jaguar",
            address: "CHN"
        };
    
        var res = await sqlsuper.listAllDbs();
        console.log(res);
    } 
    catch (error) 
    {
        console.error(error);        
    }
    finally
    {
        await sqlsuper.disconnectPgSQL();
    }

};