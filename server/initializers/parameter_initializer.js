Meteor.startup(function () {
    //console.log("ZMIANA_PARAMS");
    var globalParameters = [
        {
            "nazwaOrganizacji": "Nazwa Organizacji",
            "terytorium": "Kraj",
            "kontakty": "Kontakty",
            "regulamin": "brak regulaminu",
            "czasWyczekiwaniaKwestiiSpecjalnej":2,
            "voteQuantity": 3,
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
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
        });
    }
});