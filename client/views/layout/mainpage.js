Template.mainpage.events({
    'click #addKwestiaButton': function () {
        var kwestiaCanBeInserted = kwestiaIsAllowedToInsert();
        if (kwestiaCanBeInserted == true) {
            if (Session.get('kwestiaPreview'))
                Session.set('kwestiaPreview', null);
            Router.go('addKwestia');
        } else
            notificationPauseWarning('kwestii',kwestiaCanBeInserted);
    },
    'click #wievMap': function () {
        Router.go('map');
    },
});
