Template.map.rendered = function() {
};

Template.map.helpers({
    isAdminUser: function() {
        return IsAdminUser();
    }
});

Template.map.helpers({
    isZwyczajnyLogged:function(){
        if(IsAdminUser())
            return false;
        else {
            return Meteor.user().profile.userType == USERTYPE.CZLONEK ? true : false;
        }
    }
});
