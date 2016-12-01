module.exports = (function(){
  "use strict";
  const debug = require("debug")("service");
  const _ = require("lodash");
  const Promise = require("bluebird");
  const path = require("path");
  var popletCal = require("./popletCal");
  const fs = require("fs");
  const fileName = process.argv[2];
  const filePath = path.join(__dirname,fileName);

  var dataGrab = function(serviceIds,closedIds){
    const serviceIdArray = [].concat(serviceIds);
    const closedIdArray = [].concat(closedIds);
    var serviceFilterArray = [];
    
    _.forEach(serviceIdArray,(serviceId) => {
      var fieldExist = '{"ratio.'+serviceId+'":{"$exists":true}}';
      fieldExist = JSON.parse(fieldExist);
      serviceFilterArray.push(fieldExist);
    });
    let serviceFilter = {
      "$or":serviceFilterArray
    };
    var req = function(){
      let ratioData;
      return this._tdxApi.getDatasetDataAsync(this._config.ratioId,serviceFilter,null,{limit:5000})
              .then((response) => {
                ratioData = response.data;
                var areaObj = {};
                var areaArray = [];
                _.forEach(ratioData,(areaId) => {
                  areaId["ratio"] = _.pick(areaId["ratio"],serviceIdArray);
                  if(!areaObj[areaId["area_id"]]){
                    areaObj[areaId["area_id"]] = 1;
                    areaArray.push(areaId["area_id"]);
                  }
                });
                debug("area id array length is %d",areaArray.length);
                var popletFilter = {"area_id":{"$in":areaArray},"age_band":{"$in":this._config.ageBands},"year":"2016"};
                return this._tdxApi.getDatasetDataAsync(this._config.popletId,popletFilter,null,{limit:5000});
              })
              .then((result) =>{
                let popletData = result.data;
                debug("ratio data length is %d",ratioData.length);
                debug("poplet data length id %d",popletData.length);
                return popletCal.popletCal(ratioData,popletData);
              })
              .catch((err) => {
                debug("err retriving ratio data %s",err);
              });
    };
    req.call(this).then((result) =>{
      debug("final result length is %d",result.length);
      _.forEach(result,(eachLine) => {
        var each = JSON.stringify(eachLine)+"\n";
        fs.appendFileSync("result.json",each,"utf-8");
      });
      debug(result);
    });
  };
  
  function servicePoplet(tdxApi,config){
    this._tdxApi = Promise.promisifyAll(tdxApi);
    this._config = config;
    if(fileName){
      fs.readFile(filePath,{encoding:"utf-8"},(err,serviceIdArray) => {
        serviceIdArray = serviceIdArray.split("\n");
        dataGrab.call(this,["A81001"],[]);
      });
    }
    //dataGrab.call(this,["Y00527","A81002"],[]);
  }

  return servicePoplet;
}());