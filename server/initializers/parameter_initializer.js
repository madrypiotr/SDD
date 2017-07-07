Meteor.startup(function () {
    //console.log("ZMIANA_PARAMS");
    var globalParameters = [
        {
            "nazwaOrganizacji": TAPi18n.__('txv.ORG_NAME'),
            "terytorium": TAPi18n.__('txv.TERITORY'),
            "terytAdres": TAPi18n.__('txv.TERITADR'),
            "terytCODE": TAPi18n.__('txv.TERITCOD'),
            "terytCity": TAPi18n.__('txv.TERITCITY'),
            "kontakty": TAPi18n.__('txv.CONTACTS'),
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
