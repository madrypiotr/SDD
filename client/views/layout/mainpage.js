Template.mainpage.rendered = function() {
};

Template.mainpage.helpers({
    isAdminUser: function() {
        return IsAdminUser();
    }
});

Template.mainpage.helpers({
    isZwyczajnyLogged:function(){
        if(IsAdminUser())
            return false;
        else {
            return Meteor.user().profile.userType == USERTYPE.CZLONEK ? true : false;
        }
    }
});


Template.mainpage.events({
    'click #addKwestiaButton': function () {
        var kwestiaCanBeInserted=kwestiaIsAllowedToInsert();
        if(kwestiaCanBeInserted==true) {
            if (!!Session.get("kwestiaPreview"))
                Session.set("kwestiaPreview", null);
            Router.go("addKwestia");
        }
        else
            notificationPauseWarning("kwestii",kwestiaCanBeInserted);
    },

    'click #wievMap': function () {
            Router.go("map");
	}
 
});