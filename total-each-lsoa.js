module.exports = (function(){
  const fs = require("fs");
  const path = require("path");
  const _ = require("lodash");
  const fileName_total = process.argv[2];
  const fileName_ageBand = process.argv[3];

  var pushTotal = function(){

    fs.readFile(fileName_total,{encoding:"utf-8"},(err,dataObj) => {
      if(err)
        throw err;
      else{
        dataObj = JSON.parse(dataObj);
        let totalData = dataObj.data;
        fs.readFile(fileName_ageBand,{encoding:"utf-8"},(err,jsonData) => {
          let lineArray = jsonData.split("\n");
          _forEach(lineArray,(lineObj) => {
            lineObj = JSON.parse(lineObj);
            
          })
        })
      }//read total file else
    })
  }

}())