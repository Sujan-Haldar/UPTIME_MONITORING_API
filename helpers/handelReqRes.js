// Dependency
const url = require("url");
const {StringDecoder} = require("string_decoder")
const routes = require("../routes");
const {notFoundHandler} = require("../handlers/routeHandlers/notFoundHandler")
const {parseJSON} = require("./utilities");

// module scaffolding
const handler = {};

handler.handelReqRes = (req,res)=>{
    const parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname;
    const trimedPath = path.replace(/^\/+|\/+$/g,"");
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headerObject = req.headers;

    // Process request body start
    const decoder = new StringDecoder("utf-8");
    let realData = "";
    const requestObject = {
        parsedUrl,
        path,
        trimedPath,
        method,
        queryStringObject,
        headerObject,
    }
    req.on("data",(buffer)=>{
        realData += decoder.write(buffer)
    })

    req.on("end",()=>{
        realData += decoder.end();
        requestObject.body = parseJSON(realData);
        callChosenHandler();
    })
    // Process request body end
    

    const chosenHandler = routes[trimedPath] ? routes[trimedPath]: notFoundHandler;

    const callChosenHandler = ()=>{
        chosenHandler(requestObject,(statusCode,payLoad)=>{
            statusCode = typeof(statusCode) ==="number" ? statusCode : 200;
            payLoad = typeof(payLoad) === "object" ? payLoad : {};
    
            const payLoadString = JSON.stringify(payLoad);
            // return the final response
            res.setHeader("content-type","application/json");
            res.writeHead(statusCode);
            res.end(payLoadString);
        })
    
    }
}


module.exports = handler;