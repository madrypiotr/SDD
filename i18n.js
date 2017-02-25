i18n.setDefaultLanguage("pl");

getUserLanguage = function () {
    var defaultLang = "pl";
    var user = Users.findOne({_id: Meteor.userId()});
    if (user.profile.language)
        return user.profile.language;
    else
        return defaultLang;
};

if (Meteor.isClient) {
    Meteor.startup(function () {
        if(Meteor.user()) {
            var lang = getUserLanguage();
            TAPi18n.setLanguage(lang)
                .done(function () {
                })
                .fail(function (error_message) {
                    console.log(error_message);
                });
        }
    });
}