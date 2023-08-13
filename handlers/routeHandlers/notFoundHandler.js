// Dependency

// Module scaffolding
const handler = {};
handler.notFoundHandler = (requestObject,cb)=>{
    cb(404,{
        "message" : "Your requested content is not found"
    });
}

module.exports = handler;