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
  const log = require("debug")("single-year");
  const ageBands = ["0-4","5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80-84","85-89","90+"];
  let age_bands = ageBands.concat(ageBands);
  let dataArray = [];
  let dataString = "";
  let maleString = "";
  let femaleString = "";
  let femaleObj = {}, maleObj = {};


  var GrabFromJson = function(config){
    let gender = "male";
    fs.readFile(filePath,{encoding:"utf-8"},(err,csvData) =>{
      let lineArray = csvData.toString().split("\n");
      _.forEach(age_bands,(age_band,i) => {
        if(!femaleObj[age_band]){
          femaleObj[age_band] = {};
        }
        if(!maleObj[age_band]){
          maleObj[age_band] = {};
        }
        let thisIndex = i*5+beginIndex;
        if(i>ageBands.length-1){
          gender = "female";
          thisIndex += 1;
        }
        _.forEach(lineArray,(lineObj,j) => {
          if(j>0){
              let jsonArray = lineObj.split(",");
              if(jsonArray[0].length >0){
              var persons = Number(jsonArray[thisIndex])+Number(jsonArray[thisIndex+1])+Number(jsonArray[thisIndex+2])+Number(jsonArray[thisIndex+3])+Number(jsonArray[thisIndex+4]);
              if(i == ageBands.length -1 || i == age_bands.length-1){
                persons += Number(jsonArray[thisIndex+5]);
              }
              var totalPersons = gender == "male"?Number(jsonArray[9]):Number(jsonArray[10]);
              var ratio = totalPersons == 0?0:persons/totalPersons;
              if(gender == "male"){
                maleObj[age_band][jsonArray[0]] = ratio;
              }else if(gender == "female"){
                femaleObj[age_band][jsonArray[0]] = ratio;
              }
            }
          }
        });//forEach lineArray
        if(gender == "female"){
          let thisObj = {};
          thisObj[age_band] = femaleObj[age_band];
          femaleString += JSON.stringify(thisObj)+"\n";
        }else if(gender == "male"){
          let thisObj = {};
          thisObj[age_band] = maleObj[age_band];
          maleString += JSON.stringify(thisObj)+"\n"; 
        }
      });//forEach age_bands;


      fs.writeFile(path.join("jsonFiles","people-new-line-female-ageObj.json"),femaleString,(err) => {
        if(err)
          throw err;
        else 
          log("new-line female saved");
      });
      fs.writeFile(path.join("jsonFiles","people-new-line-male-ageObj.json"),maleString,(err) => {
        if(err)
          throw err;
        else 
          log("new-line male saved");
      });
    })
  }
  GrabFromJson(config);


}());