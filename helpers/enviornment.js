const enviornments = {};

enviornments.staging = {
    port: 3000,
    envName: "staging",
    secretKey : "kdjkdskdksdsdsd",
    maxChecks : 5,
    twilio : {
        fromPhone : "+15005550006",
        accountSid : "ACb32d411ad7fe886aac54c665d25e5c5d",
        authToken : "9455e3eb3109edc12e3d8c92768f7a67",
    },
};
enviornments.production = {
    port: 5000,
    envName: "production",
    secretKey : "yruwryweurwueyt",
    maxChecks : 5,
    twilio : {
        fromPhone : "",
        accountSid : "",
        authToken : "",
    },
};


const currentEnviorment =
    typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";
   
const enviornmentTOExport =
    typeof enviornments[currentEnviorment] === "object"
        ? enviornments[currentEnviorment]
        : enviornments["staging"]; 
module.exports = enviornmentTOExport;