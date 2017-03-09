Meteor.startup(function () {

    var tabOfLangs = [];
    if(Languages.find({}).count()==0) {
        tabOfLangs = [
            {languageName: TXV.POLISH, shortName: TXV.PL, isEnabled: true, czyAktywny: true},
            {languageName: TXV.ENGLISH, shortName: TXV.EN, isEnabled: true, czyAktywny: true},
            {languageName: TXV.GERMAN, shortName: TXV.DE, isEnabled: false, czyAktywny: false},
            {languageName: TXV.SWEDISH, shortName: TXV.SE, isEnabled: false, czyAktywny: false},
            {languageName: TXV.CZECH, shortName: TXV.CZ, isEnabled: false, czyAktywny: false},
            {languageName: TXV.FRENCH, shortName: TXV.FR, isEnabled: false, czyAktywny: false}
        ]
    }

    _.each(tabOfLangs,function(lang){
        Meteor.call('addLanguage', lang, function (error,ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error(TXV.ERROR + error.reason);
                else
                    throwError(error.reason);
            }
            else {
                _.each(Router.routes, function(route){

                    var item = {
                        idLanguage:ret,
                        routeName: route.getName(),
                        shortLanguageName:lang.shortName,
                        infoText:"",
                        czyAktywny:true
                    }
/*
                    Meteor.call('setPagesInfo', item, function (error) {
                        if (error) {
                            if (typeof Errors === "undefined")
                                Log.error(TXV.ERROR + error.reason);
                            else
                                throwError(error.reason);
                        }
                        else console.log(item.routeName+ TXV.ADDED);
                    });
*/					
                });
            }
        });
    });
});
