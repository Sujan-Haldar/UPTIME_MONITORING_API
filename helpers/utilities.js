// Dependecy
const crypto = require("crypto");
const {secretKey} = require("../helpers/enviornment")
// Module scaffolding
const utilities = {};

// String t json
utilities.parseJSON = (stringData) => {
    try {
        return JSON.parse(stringData);
    } catch (error) {
        return {};
    }
};

// Hash string
utilities.hashString = (str)=>{
    if(typeof(str) === 'string' && str.length > 0){
        const hashed = crypto
                        .createHmac("sha256",secretKey)
                        .update(str)
                        .digest('hex')
        return hashed;
    }
    return null;
}

// Create random string 
utilities.createRandomString = (strLength)=>{
    const posibleCharecter = "abcdefghijklmnopqrstwxyz123456789"
    let output = ""
    for(let i = 0;i<strLength;i++){
        const random = Math.floor(Math.random() * posibleCharecter.length);
        output = output + posibleCharecter.charAt(random);
    }
    return output;
}

module.exports = utilities;