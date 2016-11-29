module.exports = (function (){
  "use strict";
  const path = require("path");
  const fileName = process.argv[2];
  const filePath = path.join(__dirname,fileName);
  const fs = require("fs");
  const _ = require("lodash");
  const TDXAPI = require("nqm-api-tdx");
  const felameIndex = 107;
  const beginIndex = 11;
  const total_maleIndex = 9;
  const total_femalIndex = 10;
  const config = require("./config.json");
  const log = require("debug")("each-lsoa");
  const gender = process.argv[3];
  const startIndex = 3;
  const ageBands = ["0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80-84","85-89","90+"];
  let dataArray = [];
  let dataString = "";
  let dataStringRatio = "";

  var GrabFromJson = function(config){

    fs.readFile(filePath,{encoding:"utf-8"},(err,csvData) =>{
      let lineArray = csvData.toString().split("\n");
      log("read file length is %d",lineArray.length);
      var index = 0;
      _.forEach(lineArray,(lineObj,j) => {
        var jsonObj = {};
        var LSOAS = {};
        var Ratio = {};
        if(j>0){
          let colArray = lineObj.split(",");
          if(j % 2 == 1){
            if(lineArray[j+1] != undefined){
              var colArrayEven = lineArray[j+1].split(",");
              var totalNumber = 0;
              _.forEach(colArray,(colObj,i) => {
                if( colArray[startIndex+i] !== undefined && colArray[startIndex+i].length > 0 && colArray[startIndex+i] != "\r"){
                  LSOAS[colArray[startIndex+i]] = Number(colArrayEven[startIndex+i]);
                  totalNumber += Number(colArrayEven[startIndex+i]);
                }
              });
              _.forEach(LSOAS,(val,key) => {
                Ratio[key] = val/totalNumber;
              });
              var jsonObj = {
                id:index,
                practice_code: colArray[0],
                gender: gender,
                total: totalNumber,
                LSOAS:LSOAS
              };
              var ratioObj = {
                id: index,
                practice_code: colArray[0],
                gender: gender,
                LSOAS:Ratio
              };
              dataArray.push(jsonObj);
              dataString += JSON.stringify(jsonObj)+"\n";
              dataStringRatio += JSON.stringify(ratioObj) +"\n";
              index += 1;
            }
          }
        }
      });
      log("output data length is "+ dataArray.length);
      fs.writeFile("each-lsoa-"+gender+".json",dataString,(err) => {
        if(err)
          throw err;
        else 
          log("each lsoa saved");
      });
      fs.writeFile("each-lsoa-ratio-"+gender+".json",dataStringRatio,(err) => {
        if(err)
          throw err;
        else 
          log("each lsoa with ratio saved");
      })
    })
  }
  GrabFromJson(config);


}());