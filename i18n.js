i18n.setDefaultLanguage('pl');

getUserLanguage = function () {
    var defaultLang = 'pl';
    var userId = Meteor.userId();
    var user = Users.findOne({_id: userId});
    if (user && user.profile.language) {
        return user.profile.language;
    }
    return Session.get('language') || defaultLang;
};

if (Meteor.isClient) {
    Meteor.startup(function () {
        Tracker.autorun(function () {
            var lang = getUserLanguage();
            TAPi18n.setLanguage(lang)
                .done(function () {})
                .fail(function (error_message) {
                    console.log(error_message);
                });
        });
    });
}
