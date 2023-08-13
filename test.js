const data = require("./lib/data")
const {sendTwilloSms} = require("./helpers/notification")
// data.create("test","new1",{name : "Sujan"},(err)=>{
//     console.log(err);
// })

// data.read("test","new1",(err,data)=>{
//     console.log(data);
// })

// data.update("test","new1",{name : "Sujan Haldarfjfgjfgj "},(err)=>{
//     console.log(err);
// })

// data.delete("test","new",(err)=>{
//     console.log(err);
// })

// const token = typeof(requestObject.headerObject.token) === "string" ? requestObject.headerObject.token.trim() : null;

// tokenHandler._token.verify(token,phone,(isVerified)=>{
//     if(isVerified){
        
//     }else{
//         cb(403,{
//             "error" : "Authentication Faliure ..."
//         })
//     }
// })

sendTwilloSms("9932180772","isudguisadhsdhfhwfwebyfoecy 9b8weyrfcy089fwbvf9o weefv9cywefwc",(err)=>{
    console.log(err);
})

// data.list('checks',(err,filename)=>{
//     if(!err){
//         console.log(filename)
//     }
// })