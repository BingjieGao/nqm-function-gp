module.exports = (function(){
  "use strict";
  const fs = require("fs");
  const Promise = require("bluebird");
  const path = require("path");
  const _ = require("lodash");
  const fileName = process.argv[2];
  const fileName_area = process.argv[3];
  const filePath = path.join(__dirname,fileName);
  const filePath_area = path.join(__dirname,fileName_area);
  const fileName_total = process.argv[4];
  const filePath_total = path.join(__dirname,fileName_total);
  const gender = process.argv[5];
  const ageBands = ["0-4","5-9"];
  const log = require("debug")("ratio-each");
  let finalArray = [];
  let finalString = "";
  let secondString = "";
  var timeBegin = new Date();
  let dataObj = {};

  var assignAges = function(){
    fs.readFile(filePath,{encoding:"utf-8"},(err,ratioData) => {
      if(err){
        throw err;
      }
      else{
        var ratioDataArray = ratioData.split("\n"); 
        log("file length is %d",ratioDataArray.length);
        let totalObj = fs.readFileSync(filePath_total,{encoding:"utf-8"});
        totalObj = JSON.parse(totalObj).data;
        fs.readFile(filePath_area,{encoding:"utf-8"},(err,jsonData) => {
          var jsonDataArray = jsonData.split("\n");
          _.forEach(ratioDataArray,(ratioDataObj,i) =>{
            ratioDataObj = JSON.parse(ratioDataObj);
            _.forEach(jsonDataArray,(jsonDataObj,j) =>{
              jsonDataObj = JSON.parse(jsonDataObj);
              var areaRatios = {};
              var totalRatio = 0;
              _.forEach(jsonDataObj["ratios"],(persons,serviceId) =>{
                var ageRatio = persons * ratioDataObj[Object.keys(ratioDataObj)[0]][serviceId]/totalObj[jsonDataObj["area_id"]];
                if(ageRatio !== 0 && ageRatio !== null && ageRatio !== undefined){
                  areaRatios[serviceId] = ageRatio;
                  totalRatio += ageRatio;
                }
              });//forEach each serviceId in each lsoa
              let thisObj = {
                area_id:jsonDataObj["area_id"],
                gender: gender,
                period:"10-2016",
                total: totalRatio,
                age_band: Object.keys(ratioDataObj)[0],
                ratio:areaRatios
              }
              let thisString = JSON.stringify(thisObj)+"\n";
              fs.appendFileSync(path.join("jsonFiles","ratio-each-age-"+gender+".json"),thisString,"utf-8")
            });//forEach each areaId
          });//forEach each age band
        })
      }//else
    });
  }

  assignAges();
}())  