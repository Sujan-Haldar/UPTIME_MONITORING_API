// Dependency

// Module scaffolding
const handler = {};
handler.sampleHandler = (requestObject,cb)=>{
    cb(200,{
        "message" : "This is sample handelar"
    });
    // cb(200,{
    //     data : requestObject.realData,
    // });

}

module.exports = handler;