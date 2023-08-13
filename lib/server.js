// Dependency
const http = require("http");
const {handelReqRes} = require("./../helpers/handelReqRes")
const enviornment= require("./../helpers/enviornment")
// App object 
const server = {};

// App configaration
server.config = {

}

// create server
server.createServer = ()=>{
    const serverVariable = http.createServer(server.handelReqRes);
    serverVariable.listen(enviornment.port,()=>{
        console.log(`The server is running on ${enviornment.port}`);
    })
}

// Req & Res handelar
server.handelReqRes = handelReqRes;

// Start the server
server.init = ()=>{
    server.createServer();
}

module.exports = server;