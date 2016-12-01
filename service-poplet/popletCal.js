module.exports = (function(){
  "use strict";
  const debug = require("debug")("popletCal");
  const _ = require("lodash");
  const Promise = require("bluebird");

  var changeSchema = function(areaData){
    var serviceObj = {};
    var finalObj = {};
    var index = 0;

    _.forEach(areaData,(areaObj) => {
      _.forEach(areaObj["ratio"],(val,key) => {
        if(!serviceObj[key]){
          serviceObj[key] = {};
        }
        if(!serviceObj[key][areaObj["age_band"]]){
          serviceObj[key][areaObj["age_band"]] = {};
        }
        if(!serviceObj[key][areaObj["age_band"]][areaObj["gender"]]){
          serviceObj[key][areaObj["age_band"]][areaObj["gender"]] = 0;
        }
        serviceObj[key][areaObj["age_band"]][areaObj["gender"]] += val;
      });
    });
    _.forEach(serviceObj,(ageObj,serviceId) => {
      _.forEach(ageObj,(genderObj,age_band) => {
        _.forEach(genderObj,(number,gender) => {
          let thisObj = {
            serviceId: serviceId,
            gender: gender,
            age_band: age_band,
            persons: number
          };
          finalObj[index] = thisObj;
          index += 1;
        });
      });
    });
    return Promise.all(_.map(finalObj,(val) => {
      return (val);
    }));
  };

  var popletCal = function(ratioData,popletData){
    let popletObjset = {};
    _.forEach(popletData,(popletObj) => {
      if(!popletObjset[popletObj["area_id"]]){
        popletObjset[popletObj["area_id"]] = {};
      }
      if(!popletObjset[popletObj["area_id"]][popletObj["gender"]]){
        popletObjset[popletObj["area_id"]][popletObj["gender"]] = {};
      }
      if(!popletObjset[popletObj["area_id"]][popletObj["gender"]][popletObj["age_band"]]){
        popletObjset[popletObj["area_id"]][popletObj["gender"]][popletObj["age_band"]] = popletObj["persons"];
      }
    });
    
    return Promise.all(_.map(ratioData,(areaObj) => {
      var number = 0;
      if(popletObjset[areaObj["area_id"]] && popletObjset[areaObj["area_id"]][areaObj["gender"]]
        && popletObjset[areaObj["area_id"]][areaObj["gender"]][areaObj["age_band"]]){
        number = popletObjset[areaObj["area_id"]][areaObj["gender"]][areaObj["age_band"]];
      }
      _.forEach(areaObj["ratio"],(val,key) => {
        areaObj["ratio"][key] = val * number;
      });

      return (areaObj);
    }))
    .then((result) => {
      return changeSchema(result);
    })
    .catch((e) => {
      debug("poplet calculcation error %s",e);
    });
  };
  let calc = {
    popletCal:popletCal
  };
  return calc;

}());