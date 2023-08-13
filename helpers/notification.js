// Dependency
const https = require("https");
const {twilio} = require("./enviornment");
const queryString= require("querystring")
// Module scuffolding
const notification = {};

// Function to send request;
notification.sendTwilloSms = (phone,msg,cb)=>{
    const userPhone = typeof(phone) === "string" && phone.trim().length === 10 ? phone.trim():null;
    const userMsg = typeof(msg) === "string" && msg.trim().length > 10 && msg.trim().length < 1600 ? phone.trim():null;

    if(userPhone && userMsg){
        // configure the request payload
        const payload = {
            From : twilio.fromPhone,
            To : `+91${userPhone}`,
            Body : userMsg
        }
        // Stringfy the payload
        const stringPayload = queryString.stringify(payload);

        // Configure the request deatils
        const requestDetails = {
            hostname : "api.twilio.com",
            method : "POST",
            path : `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth : `${twilio.accountSid}:${twilio.authToken}`,
            headers : {
                "Content-Type":"application/x-www-form-urlencoded",
            }

        }
        // Instantiate the request
        const req = https.request(requestDetails,(res)=>{
            // Get teh stutus of send request
            const status = res.statusCode;
            if(status === 200 || status === 201){
                cb(false) // No error
            }else{
                cb(`Status code returned was ${status}`)
            }
        })
        
        req.on('error',(err)=>{
            cb(err);
        })
        
        req.write(stringPayload);
        req.end();
    }else{
        cb("Given parameters are invalid..")
    }
}

// Export the module;

module.exports = notification;