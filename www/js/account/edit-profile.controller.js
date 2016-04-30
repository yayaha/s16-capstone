/**
 * Created by weiluo on 3/10/16.
 */

angular.module('emiratesApp')
  .controller('ProfileCtrl', function(md5, profile, auth, $state, $filter) {
    var profileCtrl = this;

    profileCtrl.profile = profile;
    profileCtrl.profile.email = auth.password.email;
    profileCtrl.profile.emailHash = md5.createHash(auth.password.email);
    profileCtrl.profile.gravatar = 'http://www.gravatar.com/avatar/' + profileCtrl.profile.emailHash + '?s=400';
    profileCtrl.profile.balance = {
      'available': 1000000,
      'pending': 0
    };
    if (profileCtrl.profile.dob) {
      profileCtrl.dob = new Date(profileCtrl.profile.dob);
      // Adjust timezone offset.
      profileCtrl.dob.setTime(profileCtrl.dob.getTime() + profileCtrl.dob.getTimezoneOffset()*60*1000)
    }

    profileCtrl.updateProfile = function() {
      if (profileCtrl.dob) {
        profileCtrl.profile.dob = $filter('date')(profileCtrl.dob, 'yyyy-MM-dd');
      }
      profileCtrl.profile.$save().then(function() {
        $state.go('tab.account-dash');
      });
    }
  });
