Meteor.startup(function () {
    const lang = LANGUAGES.DEFAULT_LANGUAGE;
    var globalParameters = [{
        'nazwaOrganizacji': TAPi18n.__('txv.MISSING_ORG_NAME', null, lang),
        'terytorium': TAPi18n.__('txv.MISSING_TERITORY', null, lang),
        'terytAdres': TAPi18n.__('txv.MISSING_TERITADR', null, lang),
        'terytCODE': TAPi18n.__('txv.MISSING_TERITCOD', null, lang),
        'terytCity': TAPi18n.__('txv.MISSING_TERITCITY', null, lang),
        'kontakty': TAPi18n.__('txv.MISSING_CONTACTS', null, lang),
        'regulamin': TAPi18n.__('txv.MISSING_RULES', null, lang),
        'czasWyczekiwaniaKwestiiSpecjalnej': 1,
        'voteQuantity': 3,
        'voteDuration': 1,
        'addIssuePause': 2,
        'addCommentPause': 2,
        'addReferencePause': 2,
        'okresSkladaniaRR': 2,
        'regStart': 5
    }];
    if (Parametr.find().count() == 0) {
        Meteor.call('addParametr', globalParameters, function (error) {
            if (error) {
                if (typeof Errors === 'undefined')
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else {
                    throwError(error.reason);
                }
            }
        });
    }
});
