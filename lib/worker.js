// Dependency
const url = require("url");
const http = require("http");
const https = require("https");
const datalib = require("./data")
const { parseJSON } = require("./../helpers/utilities")
const {sendTwilloSms} = require("./../helpers/notification")
// Worker object 
const worker = {};

// Look up all the checks
worker.gatherAllChecks = () => {
    // get all the checks
    datalib.list("checks", (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach(check => {
                // read the checkData
                datalib.read("checks", check, (err2, originalCheckData) => {
                    if (!err2 && originalCheckData) {
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log("Error : Could not read one of the file..")
                    }
                })
            });
        } else {
            console.log("Error : Could not find any file for process..")
        }
    })
}

worker.validateCheckData = (originalCheckData) => {
    if (originalCheckData && originalCheckData.id) {
        originalCheckData.state = typeof (originalCheckData.state) === "string" && (originalCheckData.state === "up" || originalCheckData.state === "down") ? originalCheckData.state : "down";

        originalCheckData.lastChcked = typeof (originalCheckData.lastChcked) === "number" && originalCheckData.lastChcked > 0 ? originalCheckData.lastChcked : false;

        // Pass to the next process
        worker.performCheck(originalCheckData);
    } else {
        console.log(`Error : The check is invalid..`)
    }
}

// Perfrom check
worker.performCheck = (originalCheckData)=>{
    // Mark the outcome has not been sent yet
    let outComeSent = false

    // Parse the hostname and full url from original data
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`,true);
    const hostname = parsedUrl.hostname;
    const path = parsedUrl.path;

    // Construct the request
    const requestDetails = {
        protocol : `${originalCheckData.protocol}:`,
        hostname : hostname,
        method : originalCheckData.method.toUpperCase(),
        path,
        timeout : originalCheckData.timeoutSeconds * 1000,
    }

    const protocolToUse = originalCheckData.protocol === "http"?http:https;

    const req = protocolToUse.request(requestDetails,(res)=>{
        const status = res.statusCode;

        // Update the check outcome and pass to next process
        if(!outComeSent){
            outComeSent = true;
            worker.processCheckOutcome(originalCheckData,{
                error : false,
                responnseCode: status
            })
        }
    })

    req.on("error",(e)=>{
        if(!outComeSent){
            outComeSent = true;
            worker.processCheckOutcome(originalCheckData,{
                error : true,
                value: e
            })
        }
    })

    req.on("timeout",()=>{
        if(!outComeSent){
            outComeSent = true;
            worker.processCheckOutcome(originalCheckData,{
                error : true,
                value: "timeout"
            })
        }
    })
    req.end();
}

worker.processCheckOutcome = (originalCheckData,checkoutCome)=>{
    // check if check oucome is up or down
    const state = !checkoutCome.error && checkoutCome.responnseCode && originalCheckData.sucessCodes.indexOf(checkoutCome.responnseCode) > -1 ? "up" : "down";

    // Decide whether we sould sent the error or not
    const alertWanted = originalCheckData.lastChcked && originalCheckData.state !== state ? true : false;

    // update the checkData
    const newCheckdata = {...originalCheckData};
    newCheckdata.state = state;
    newCheckdata.lastChcked = Date.now();
    // Update newCheckdata into db
    datalib.update("checks",newCheckdata.id,newCheckdata,(err)=>{
        if(!err){
            if(alertWanted){
                worker.alertUserToStateChanged(newCheckdata);
            }else{
                console.log("Alert is not needed as there is no state changed...")
            }
        }else{
            console.log("Error : Trying to save one of the check data after update");
        }
    })
}

// Send alert to user for state change
worker.alertUserToStateChanged = (newCheckdata)=>{
    const msg = `Alert : Your check for ${newCheckdata.method.toUpperCase()} ${newCheckdata.protocol}://${newCheckdata.url} is currently ${newCheckdata.state}`
    sendTwilloSms(newCheckdata.phone,msg,(err)=>{
        if(!err){
            console.log(`User was alerted to a suatus change via sms : ${msg}`);
        }else{
            console.log("Error : There was a problem to send sms to a user..");
        }
    })
}
// Timer to execute worker function once at a time
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 60);
}

// Start the worker
worker.init = () => {
    // Execute all the check 
    worker.gatherAllChecks();

    // Call the loop so the checks continue
    worker.loop();
}

module.exports = worker;