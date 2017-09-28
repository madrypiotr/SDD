i18n.setDefaultLanguage('pl');

if (Meteor.isClient) {
    Meteor.startup(function () {
        Tracker.autorun(function () {
            const lang = Etc.getUserLanguage();
            TAPi18n.setLanguage(lang)
                .done(function () {})
                .fail(function (error_message) {
                    console.log(error_message);
                });
        });
    });
}
