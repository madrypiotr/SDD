Meteor.startup(function () {

    var tabOfLangs = [];
    if(Languages.find({}).count()==0) {
        tabOfLangs = [
            {languageName: "polski", shortName: "pl", isEnabled: true, czyAktywny: true},
            {languageName: "angielski", shortName: "en", isEnabled: true, czyAktywny: true},
            {languageName: "niemiecki", shortName: "de", isEnabled: true, czyAktywny: true},
            {languageName: "szwedzki", shortName: "se", isEnabled: true, czyAktywny: true},
            {languageName: "francuski", shortName: "fr", isEnabled: true, czyAktywny: true}
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

                    Meteor.call('setPagesInfo', item, function (error) {
                        if (error) {
                            if (typeof Errors === "undefined")
                                Log.error(TXV.ERROR + error.reason);
                            else
                                throwError(error.reason);
                        }
                        else console.log(item.routeName+" added");
                    });
                });
            }
        });
    });
});
