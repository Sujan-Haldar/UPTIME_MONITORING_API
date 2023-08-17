// Dependency
const {hashString, parseJSON} = require("./../../helpers/utilities")
const datalib = require("./../../lib/data")
const tokenHandler = require("./tokenHandler")

// Module scaffolding
const handler = {};
handler.userHandler = (requestObject, cb) => {
    const method = requestObject.method;

    if (method == "get" || method == "post" || method == "put" || method == "delete") {
        handler._user[method](requestObject, cb);
    } else {
        cb(405);
    }
}

handler._user = {};

handler._user.get = (requestObject, cb) => {
    const phone = typeof (requestObject.queryStringObject.phone) === "string" && requestObject.queryStringObject.phone.trim().length === 10 ? requestObject.queryStringObject.phone.trim() : null;

    const token = typeof(requestObject.headerObject.token) === "string" ? requestObject.headerObject.token.trim() : null;
    
    if(phone){
        tokenHandler._token.verify(token,phone,(isVerified)=>{
            if(isVerified){
                datalib.read("users",phone,(err,data)=>{
                    if(!err && data){
                        let user = data;
                        user = parseJSON(data);
                        delete user.password;
                        cb(200,user);
        
                    }else{
                        cb(404,{
                            error : "Requested User is not found"
                        })
                    }
                })
            }else{
                cb(403,{
                    "error" : "Authentication Faliure ..."
                })
            }
        })
        
    }else{
        cb(404,{
            error : "Requested User is a not found"
        })
    }
}

handler._user.post = (requestObject, cb) => {
    const firstName = typeof (requestObject.body.firstName) === "string" && requestObject.body.firstName.trim().length > 0 ? requestObject.body.firstName.trim() : null;

    const lastName = typeof (requestObject.body.lastName) === "string" && requestObject.body.lastName.trim().length > 0 ? requestObject.body.lastName.trim() : null;

    const phone = typeof (requestObject.body.phone) === "string" && requestObject.body.phone.trim().length === 10 ? requestObject.body.phone.trim() : null;

    const password = typeof (requestObject.body.password) === "string" && requestObject.body.password.trim().length > 0 ? requestObject.body.password.trim() : null;

    const tosAggrement = typeof (requestObject.body.tosAggrement) === "boolean" ? requestObject.body.tosAggrement : false;
    const checks = [];
    if(firstName && lastName && phone && password && tosAggrement){
        datalib.read("users",phone,(err1,user)=>{
            if(err1){
                const newUser = {
                    firstName,
                    lastName,
                    phone,
                    password : hashString(password),
                    tosAggrement,
                    checks
                }

                // Strore the data into db
                datalib.create("users",phone,newUser,(err2)=>{
                    if(!err2){
                        cb(200, {
                            message : "User was created successfully.."
                        });
                    }else{
                        cb(500, {
                            error : "There was a problem in server side.."
                        });
                    }
                })
            }else{
                cb(500, {
                    error : "There was a problem in server side.."
                });
            }
        })
    }else{
        cb(400, {
            error : "You have a problem in your request.."
        });
    }

    
}

handler._user.put = (requestObject, cb) => {
    const firstName = typeof (requestObject.body.firstName) === "string" && requestObject.body.firstName.trim().length > 0 ? requestObject.body.firstName.trim() : null;

    const lastName = typeof (requestObject.body.lastName) === "string" && requestObject.body.lastName.trim().length > 0 ? requestObject.body.lastName.trim() : null;

    const phone = typeof (requestObject.body.phone) === "string" && requestObject.body.phone.trim().length === 10 ? requestObject.body.phone.trim() : null;

    const password = typeof (requestObject.body.password) === "string" && requestObject.body.password.trim().length > 0 ? requestObject.body.password.trim() : null;

    const token = typeof(requestObject.headerObject.token) === "string" ? requestObject.headerObject.token.trim() : null;
    
    if(phone){
        tokenHandler._token.verify(token,phone,(isVerified)=>{
            if(isVerified){
                if(firstName || lastName || password){
                    datalib.read("users",phone,(err1,data)=>{
                        if(!err1 && data){
                            let user = data;
                            user = parseJSON(user);
                            if(firstName){
                                user.firstName = firstName;
                            }
                            if(lastName){
                                user.lastName = lastName;
                            }
                            if(password){
                                user.password = hashString(password);
                            }
                            datalib.update("users",phone,user,(err)=>{
                                if(!err){
                                    cb(200, {
                                        message : "User updated successfully.."
                                    });
                                }else{
                                    cb(500, {
                                        error : "There was a problem in d server side.."
                                    });
                                }
                        })
                        }else{
                            cb(400, {
                                error : "Invalid phone Number.."
                            });
                        }
                    })
                }else{
                    cb(400, {
                        error : "You have a problem in your request.."
                    }); 
                }
            }else{
                cb(403,{
                    "error" : "Authentication Faliure ..."
                })
            }
        })


    }else{
        cb(400, {
            error : "You have a problem in your request.."
        });
    }
}

handler._user.delete = (requestObject, cb) => {
    const phone = typeof (requestObject.queryStringObject.phone) === "string" && requestObject.queryStringObject.phone.trim().length === 10 ? requestObject.queryStringObject.phone.trim() : null;
    
    const token = typeof(requestObject.headerObject.token) === "string" ? requestObject.headerObject.token.trim() : null;
    if(phone){
        tokenHandler._token.verify(token,phone,(isVerified)=>{
            if(isVerified){
                datalib.read("users",phone,(err1,data)=>{
                    if(!err1 && data){
                        datalib.delete("users",phone,(err)=>{
                            if(!err){
                                cb(200,{
                                    message : "Your delete request has been processed successfully.."
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
                cb(403,{
                    "error" : "Authentication Faliure ..."
                })
            }
        })  
    }else{
        cb(400,{
            error : "There was a problem in your input.."
        })
    }

}


module.exports = handler;