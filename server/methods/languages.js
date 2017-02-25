Meteor.methods({
    addLanguage: function (item) {
        var id = Languages.insert({
            languageName: item.languageName,
            shortName: item.shortName,
            isEnabled:item.isEnabled,
            czyAktywny: item.czyAktywny
        });
        return id;
    },
    updateLanguage: function (id, item) {
        Languages.update(id, {$set: {languageName:item.languageName,shortName:item.shortName}}, {upsert: true});
    },
    updateLanguageEnabled: function (id, item) {
        Languages.update(id, {$set: {isEnabled:item.isEnabled}}, {upsert: true});
    },
    // metody dodawania informacji o stronie
    setPagesInfo: function (item) {
        var pageInfo = PagesInfo.findOne({idLanguage:item.idLanguage,routeName:item.routeName});
        if(!!pageInfo) {
            PagesInfo.update(pageInfo._id,{$set: {infoText: item.infoText}});
        } else {
            PagesInfo.insert({
                idLanguage: item.idLanguage,
                routeName: item.routeName,
                shortLanguageName: item.shortLanguageName,
                infoText: item.infoText,
                czyAktywny: item.czyAktywny
            });
        }
    }

});