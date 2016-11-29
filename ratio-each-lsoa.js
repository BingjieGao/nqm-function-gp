module.exports = (function (){
  "use strict";
  const path = require("path");
  const fileName = process.argv[2];
  const filePath = path.join(__dirname,fileName);
  const fs = require("fs");
  const _ = require("lodash");
  const config = require("./config.json");
  const log = require("debug")("each-lsoa");
  const gender = process.argv[3];
  const startIndex = 3;
  let dataString = "";
  let LSOAObj = {};

  function getFilePath(folderName,fileName){
    return path.join(__dirname,path.join(folderName,fileName));
  }

  var GrabFromJson = function(config){

    fs.readFile(filePath,{encoding:"utf-8"},(err,csvData) =>{
      let lineArray = csvData.toString().split("\n");
      log("read file length is %d",lineArray.length);

      _.forEach(lineArray,(lineObj,j) => {
        if(j>0){
          let colArray = lineObj.split(",");
          if(j % 2 === 1){
            if(lineArray[j+1] !== undefined){
              var colArrayEven = lineArray[j+1].split(",");

              _.forEach(colArray,(colObj,i) => {
                if( colArray[startIndex+i] !== undefined && colArray[startIndex+i].length > 0 && colArray[startIndex+i] != "\r"){
                  if(!LSOAObj[colArray[startIndex+i]]){
                    LSOAObj[colArray[startIndex+i]] = {};
                    LSOAObj[colArray[startIndex+i]][colArray[0]] = Number(colArrayEven[startIndex+i])
                  }else{
                    LSOAObj[colArray[startIndex+i]][colArray[0]] = Number(colArrayEven[startIndex+i])
                  }//if LSOA in the object
                }
              });//forEach colArray;
            }
          }
        }
      });
      _.forEach(LSOAObj,(val,key) => {
        let ratios = {};
        let ratioString = "";
        _.forEach(val,(persons,serviceId) => {
          ratios[serviceId] = persons;
          ratioString += serviceId;
        });//forEach persons serviceId;
        let areaId = {
          area_id: key,
          gender: gender,
          period:"10-2016",
          ratioString:ratioString,
          ratios:ratios
        };
        dataString += JSON.stringify(areaId)+"\n"; 
      });

      fs.writeFile(getFilePath("jsonFiles","each-lsoa-"+gender+".json"),dataString,(err) => {
        if(err)
          throw err;
        else 
          log("each lsoa saved");
      });
    });
  };
  GrabFromJson(config);


}());