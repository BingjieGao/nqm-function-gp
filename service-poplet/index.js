module.exports = (function(){
  "use strict";
  var removeService = require("./remove-serviceId");
  const TDXAPI = require("nqm-api-tdx");
  const config = require("../config");

  var tdxApi = new TDXAPI({
    commandHost:config.commandHost,
    queryHost:config.queryHost
  });

  //var servicePoplet = require("./remove-serviceId")(tdxApi,config);
  tdxApi.authenticate(config.shareKeyId,config.shareKeySecret,(err,accessToken) => {
    let servicePoplet = new removeService(tdxApi,config);
  });
  
}());