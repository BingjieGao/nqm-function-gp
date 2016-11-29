module.exports = (function(){
  "use strict";
  const popletURL = "https://q.nq-m.com/v1/datasets/SJxzMvRIye/data?filter={'age_band':{'$regex':'-'},'year':'2016'}&opts={'limit':1388}";
  const debug = require("debug")("service");
  const _ = require("lodash");
  const Promise = require("bluebird");
  const TDXAPI = require("nqm-api-tdx");
  const config = require("./config.json");



  var tdxApi = new TDXAPI({
    commandHost:config.commandHost,
    queryHost:config.queryHost
  });
  Promise.promisifyAll(tdxApi);
  tdxApi.authenticate(config.shareId,config.shareKey,(err,accessToken) => {
    if(err){
      debug("Fail to authenticate TDX "+err);
    }else{
      debug("connected to TDX API");
      dataGrab(tdxApi,config);
    }
  });

  function dataGrab(tdxApi,config){
    let ageFilter = {"age_band":{"$regx":/-/gm},"year":"2016"};
    tdxApi.getDatasetDataAsync(config.popletId,ageFilter,null,{limit:5000})
          .then((response) => {
            let popletData = response.data;
            tdxApi.getDatasetDataAsync(config.ratioId,null,null,{limit:5000})
                  .then((response) => {
                    let ratioData = response.data;
                    
                  })
                  .catch((err) => {
                    debug("retriving ratio data err %s",err);
                  });
          })
          .catch((err) => {
            debug("retriving poplet data err %s",err);
          });
  }
}());