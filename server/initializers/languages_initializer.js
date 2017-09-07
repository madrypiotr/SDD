Meteor.startup(function () {

    var tabOfLangs = [];
    if (Languages.find({ }).count() == 0) {
        tabOfLangs = [
            {languageName: TAPi18n.__('txv.POLISH'), shortName: TAPi18n.__('txv.PL'), isEnabled: true, czyAktywny: true},
            {languageName: TAPi18n.__('txv.ENGLISH'), shortName: TAPi18n.__('txv.EN'), isEnabled: true, czyAktywny: true},
            {languageName: TAPi18n.__('txv.GERMAN'), shortName: TAPi18n.__('txv.DE'), isEnabled: false, czyAktywny: false},
            {languageName: TAPi18n.__('txv.SWEDISH'), shortName: TAPi18n.__('txv.SE'), isEnabled: false, czyAktywny: false},
            {languageName: TAPi18n.__('txv.CZECH'), shortName: TAPi18n.__('txv.CZ'), isEnabled: false, czyAktywny: false},
            {languageName: TAPi18n.__('txv.FRENCH'), shortName: TAPi18n.__('txv.FR'), isEnabled: false, czyAktywny: false}
        ];
    }

    _.each(tabOfLangs,function (lang) {
        Meteor.call('addLanguage', lang, function (error,ret) {
            if (error) {
                if (typeof Errors === 'undefined')
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else
                    throwError(error.reason);
            } else {
                _.each(Router.routes, function (route) {

                    var item = {
                        idLanguage:ret,
                        routeName: route.getName(),
                        shortLanguageName:lang.shortName,
                        infoText:'',
                        czyAktywny: true
                    };
                });
            }
        });
    });
});
