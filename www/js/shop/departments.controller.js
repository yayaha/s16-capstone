/**
 * Created by weiluo on 3/11/16.
 */

angular.module('emiratesApp')
  .controller('DepartmentsCtrl', function(departments) {
    var departmentsCtrl = this;

    departmentsCtrl.departments = departments;

  });
