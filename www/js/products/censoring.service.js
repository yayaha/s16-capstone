/**
 * Created by weiluo on 4/30/16.
 */
angular.module('emiratesApp')
  .factory('Censor', function () {

    //var Censoring = require('censoring');
    var scan = new Censoring();
    scan.enableFilter('words');

    scan.addFilterWords(["alcohol", "AK-47", "weiluo"]);

    return {
      censor: function (text) {
        scan.prepare(text, true);
        if (scan.test()) {
          return scan.replace();
        } else {
          return null;
        }
      }
    }
  });
