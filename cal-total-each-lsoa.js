module.exports = (function(){
  "use strict";
  const fs = require("fs");
  const path = require("path");
  const _ = require("lodash");
  const log = require("debug")("total-each-lsoa");
  const fileName = process.argv[2];
  const filePath = path.join(__dirname,fileName);
  const gender = process.argv[3];

  let dataObj = {};

  var totalCal = function(){
    fs.readFile(filePath,{encoding:"utf-8"},(err,csvData) => {
      if(err)
        throw err;
      else{
        let csvDataArray = csvData.toString().split("\n");
        _.forEach(csvDataArray,(lineObj,j) => {
            if(j>0){
              let dataArray = lineObj.split(",");
              if(j % 2 == 1 && csvDataArray[j+1] != undefined){
                var lineArrayEven = csvDataArray[j+1].split(",");
                var beginIndex = 0;
                _.forEach(dataArray,(data,i) =>{
                  if( (dataArray[i] == "LSOA_CODE")){
                    beginIndex = i+1;
                  }
                  if(beginIndex > 0
                      && (dataArray[beginIndex] !== undefined)
                      && (dataArray[beginIndex].indexOf("\r") == -1)){
                    if(!dataObj[dataArray[beginIndex]]){
                        dataObj[dataArray[beginIndex]] = 0;
                      }
                    dataObj[dataArray[beginIndex]] += Number(lineArrayEven[beginIndex]);
                    beginIndex += 1;
                  }
                });//forEach dataArray
              }//j%2 == 1
            }//j>0  
        });//forEach csvData;
        let finalObj = {
          data: dataObj
        }
        fs.writeFile(getFilePath("jsonFiles","total-people-lsoa-"+gender+".json"),JSON.stringify(finalObj),(err) =>{
          if(err){
            log("err while saving file %s",err);
          }else{
            log("file saved");
          }
        })
      }//else
    })
  }
  function getFilePath(folderName,fileName){
    return path.join(__dirname,path.join(folderName,fileName));
  }

  totalCal();
}())