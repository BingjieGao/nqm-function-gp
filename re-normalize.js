module.exports = (function(){
  "use strict";
  const fs = require("fs");
  const _ = require("lodash");
  const path = require("path");
  const fileName = process.argv[2];
  const filePath = path.join(__dirname,fileName);
  const readline = require("readline");

  let rl = readline.createInterface({
    input:fs.createReadStream(filePath)
  });

  var reNormalize = function(){
    rl.on("line",(jsonDataObj) =>{
      jsonDataObj = JSON.parse(jsonDataObj);
      let totalRatio = jsonDataObj["total"];
      _.forEach(jsonDataObj["ratio"],(val,key) => {
        jsonDataObj["ratio"][key] = val/totalRatio;
      });
      jsonDataObj = _.omit(jsonDataObj,["total"]);
      let jsonDataString = JSON.stringify(jsonDataObj)+"\n";
      fs.appendFileSync(path.join("jsonFiles","ratio-each-age-normoalized.json"),jsonDataString,"utf-8");
    });
  };

  reNormalize();


}());