// Dependency
const {hashString, parseJSON,createRandomString} = require("./../../helpers/utilities")
const datalib = require("./../../lib/data")


// Module scaffolding
const handler = {};
handler.tokenHandler = (requestObject, cb) => {
    const method = requestObject.method;
    if (method == "get" || method == "post" || method == "put" || method == "delete") {
        handler._token[method](requestObject, cb);
    } else {
        cb(405);
    }
}

handler._token = {};

handler._token.get = (requestObject, cb) => {
    const id = typeof (requestObject.queryStringObject.id) === "string" && requestObject.queryStringObject.id.trim().length === 20 ? requestObject.queryStringObject.id.trim() : null;
    if(id){
        datalib.read("tokens",id,(err,data)=>{
            if(!err && data){
                let tokenObject = data;
                tokenObject = parseJSON(data);
                cb(200,tokenObject);

            }else{
                cb(404,{
                    error : "Requested Token is not found"
                })
            }
        })
    }else{
        cb(404,{
            error : "Requested Token is a not found"
        })
    }
}

handler._token.post = (requestObject, cb) => {
    const phone = typeof (requestObject.body.phone) === "string" && requestObject.body.phone.trim().length === 10 ? requestObject.body.phone.trim() : null;

    const password = typeof (requestObject.body.password) === "string" && requestObject.body.password.trim().length > 0 ? requestObject.body.password.trim() : null;

    if(phone && password){
        datalib.read("users",phone,(err1,data)=>{
            if(!err1 && data){
                const hashedPass = hashString(password);
                let user = data;
                user = parseJSON(user);
                if(user.password === hashedPass){
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60*60*1000 //Token is valid for 1 hr
                    const tokenObject = {
                        phone,
                        "id" : tokenId,
                        expires
                    }
                    datalib.create("tokens",tokenId,tokenObject,(err2)=>{
                        if(!err2){
                            cb(200,tokenObject)
                        }else{
                            cb(500,{
                                error : "There was a problem in server side.."
                            })
                        }
                    })
                }else{
                    cb(400,{
                        error : "Password is not valid.."
                    })
                }
            }else{
                cb(500,{
                    error : "There was a problem in server side.."
                })
            }
        })
    }else{
        cb(400,{
            error : "You have a problem in your request.."
        })
    }
}

handler._token.put = (requestObject, cb) => {
    const id = typeof (requestObject.body.id) === "string" && requestObject.body.id.trim().length === 20 ? requestObject.body.id.trim() : null;

    const isExtend = typeof(requestObject.body.isExtend) === "boolean" ? requestObject.body.isExtend :false;
    if(id && isExtend){
        datalib.read("tokens",id,(err1,data)=>{
            if(!err1 && data){
                let tokenObject = {...parseJSON(data)}
                if(tokenObject.expires > Date.now()){
                    tokenObject.expires = Date.now() + 60*60*1000;

                    // Store the updated token object
                    datalib.update("tokens",id,tokenObject,(err2)=>{
                        if(!err2){
                            cb(200,{
                                message : "Token is updated.."
                            })
                        }else{
                            cb(500,{ 
                                error : "There was a problem in server side.."
                            })
                        }
                    })
                }else{
                    cb(400,{
                        error : "Token is already expired.."
                    })
                }
            }else{
                cb(500,{
                    error : "There was a problem in server side.."
                })
            }
        })
    }else{
        cb(400,{
            error : "You have a problem in your request.."
        })
    }
}

handler._token.delete = (requestObject, cb) => {
    const id = typeof (requestObject.queryStringObject.id) === "string" && requestObject.queryStringObject.id.trim().length === 20 ? requestObject.queryStringObject.id.trim() : null;
    if(id){
        datalib.read("tokens",id,(err1,data)=>{
            if(!err1 && data){
                datalib.delete("tokens",id,(err)=>{
                    if(!err){
                        cb(200,{
                            message : "Token was successfully deleted.."
                        })
                    }else{
                        cb(500,{
                            error : "There was a server side error.."
                        })
                    }
                })
            }else{
                cb(500,{
                    error : "There was a server side error.."
                })
            }
        })
    }else{
        cb(400,{
            error : "There was a problem in your request.."
        })
    }
}

handler._token.verify = (id,phone,cb)=>{
    datalib.read("tokens",id,(err,data)=>{
        if(!err && data){
            const tokenObject = {...parseJSON(data)};
            if(tokenObject.phone === phone && tokenObject.expires > Date.now()){
                cb(true);
            }else {
                cb(false);
            }
        }else{
            cb(false);
        }
    })
}


module.exports = handler;