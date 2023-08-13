const fs = require("fs");
const path = require("path");

const lib = {};

// Base dir of data folder.
lib.baseDir = path.join(__dirname, "../.data/")

// Create ne file and Write data to that file
lib.create = (dir, file, data, cb) => {
    fs.open(path.join(lib.baseDir, dir, `/${file}.json`), "wx", (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            data = JSON.stringify(data);
            fs.writeFile(fileDescriptor, data, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            cb(false);
                        } else {
                            cb("Error closing of new file.")
                        }
                    })
                } else {
                    cb("Error writing to new file.")
                }
            })
        } else {
            cb("Could not create the file ,It may be exists")
        }
    })
}

lib.read = (dir, file, cb) => {
    fs.readFile(path.join(lib.baseDir, dir, `/${file}.json`), "utf-8", (err, data) => {
        cb(err, data);
    })
}

// Update data of a existing file: 
lib.update = (dir, file, data, cb) => {
    fs.open(path.join(lib.baseDir, dir, `/${file}.json`), "r+", (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            data = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    fs.writeFile(fileDescriptor, data, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    cb(false);
                                } else {
                                    cb("Error closing of new file.")
                                }
                            })
                        } else {
                            cb("Error writing to new file.")
                        }
                    })
                } else {
                    cb("Error truncateing file!")
                }
            })
        } else {
            cb("Error Updating! file may not exist.")
        }
    })
}

lib.delete = (dir, file, cb) =>{
    fs.unlink(path.join(lib.baseDir, dir, `/${file}.json`),(err)=>{
        if(!err){
            cb(false);
        }else{
            cb("Error Deleting file.")
        }
    })
}

// List all the file in a directory
lib.list = (dir,cb)=>{
    fs.readdir(path.join(lib.baseDir,dir),(err,files)=>{
        if(!err && files && files.length > 0){
            const trimmedFileName = [];
            files.forEach((file)=>{
                trimmedFileName.push(file.replace('.json',''));
            })
            cb(false,trimmedFileName);
        }else{
            cb("Error reading directory")
        }
    })
}
module.exports = lib;