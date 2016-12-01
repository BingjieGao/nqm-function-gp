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
  const period = process.argv[4];
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
              var startIndex = 0;

              _.forEach(colArray,(colObj,i) => {
                if(colArray[i] === "LSOA_CODE"){
                  startIndex = i;
                }
                if(startIndex > 0 && i > startIndex){
                  if( colArray[i] !== undefined && colArray[i].length > 0 && colArray[i] !== "\r"
                      && colArray[i].indexOf("NO2011") === -1){
                    if(!LSOAObj[colArray[i]]){
                      LSOAObj[colArray[i]] = {};
                      LSOAObj[colArray[i]][colArray[0]] = Number(colArrayEven[i]);
                    }else{
                      LSOAObj[colArray[i]][colArray[0]] = Number(colArrayEven[i]);
                    }//if LSOA in the object
                  }
                }
              });//forEach colArray;
            }
          }
        }
      });
      _.forEach(LSOAObj,(val,key) => {
        let ratios = {};
        _.forEach(val,(persons,serviceId) => {
          ratios[serviceId] = persons;
        });//forEach persons serviceId;
        let areaId = {
          area_id: key,
          gender: gender,
          period:"10-2016",
          ratios:ratios
        };
        dataString += JSON.stringify(areaId)+"\n"; 
      });

      fs.writeFile(getFilePath("jsonFiles-2014","each-lsoa-"+gender+".json"),dataString,(err) => {
        if(err)
          throw err;
        else 
          log("each lsoa saved");
      });
    });
  };
  GrabFromJson(config);


}());