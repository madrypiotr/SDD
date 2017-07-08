Meteor.startup(function () {
    //console.log("ZMIANA_PARAMS");
    var globalParameters = [
        {
            "nazwaOrganizacji": TAPi18n.__(txv.MISSING_ORG_NAME),
            "terytorium": TAPi18n.__('txv.MISSING_TERITORY'),
            "terytAdres": TAPi18n.__('txv.MISSING_TERITADR'),
            "terytCODE": TAPi18n.__('txv.MISSING_TERITCOD'),
            "terytCity": TAPi18n.__('txv.MISSING_TERITCITY'),
            "kontakty": TAPi18n.__('txv.MISSING_CONTACTS'),
            "regulamin": TAPi18n.__('txv.MISSING_RULES'),
            "czasWyczekiwaniaKwestiiSpecjalnej":1,
            "voteQuantity":3,
            "voteDuration":1,
            "addIssuePause":2,
            "addCommentPause":2,
            "addReferencePause":2,
            "okresSkladaniaRR":2
        }
    ];
    if (Parametr.find().count() == 0) {
        Meteor.call('addParametr', globalParameters, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else {
                    throwError(error.reason);
                }
            }
        });
    }
});
