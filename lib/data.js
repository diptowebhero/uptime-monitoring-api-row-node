/*
 * Title: Data Storage in file system
 * Description:Data Storage in file system
 * Author: Dipto Das
 * Date: 09-May-2023
 */

//dependencies
const fs = require("fs");
const path = require("path");

//module scaffolding
const lib = {};

//base directory of the folder
lib.basedir = path.join(__dirname, "/../.data/");

//data create form file
lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err1, fd) => {
    if (!err1 && fd) {
      //covert data to string
      const stringData = JSON.stringify(data);

      //write the data after close it
      fs.write(fd, stringData, (err2) => {
        if (!err2) {
          fs.close(fd, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback("Error, closing the file!");
            }
          });
        } else {
          callback("Error written file!");
        }
      });
    } else {
      callback("Could not create the file, It's already exits");
    }
  });
};

//read data form file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

//update data form existing file
lib.update = (dir, file, data, callback) => {
  //file open for write
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fd) => {
    if (!err && fd) {
      //convert data to string
      const stringData = JSON.stringify(data);
      //truncate file
      fs.ftruncate(fd, (err1) => {
        if (!err1) {
          //write the file and close it
          fs.writeFile(fd, stringData, (err3) => {
            if (!err3) {
              fs.close(fd, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback("Error,closing file!");
                }
              });
            } else {
              callback("Error,write file!");
            }
          });
        } else {
          callback("Error, truncate the file!");
        }
      });
    } else {
      callback("Error, updating file not Exits");
    }
  });
};

//delete file
lib.delete = (dir, file, callback) => {
  //unlink file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error,delete file!");
    }
  });
};
module.exports = lib;
