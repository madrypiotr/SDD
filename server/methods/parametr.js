Meteor.methods({
    addParametr: function(newParametr) {
        Parametr.insert({
            nazwaOrganizacji: newParametr[0].nazwaOrganizacji,
            terytorium: newParametr[0].terytorium,
            kontakty: newParametr[0].kontakty,
            regulamin: newParametr[0].regulamin,
            voteDuration: newParametr[0].voteDuration,
            voteQuantity: newParametr[0].voteQuantity,
            czasWyczekiwaniaKwestiiSpecjalnej:newParametr[0].czasWyczekiwaniaKwestiiSpecjalnej,
            addIssuePause:newParametr[0].addIssuePause,
            addCommentPause:newParametr[0].addCommentPause,
            addReferencePause:newParametr[0].addReferencePause,
            okresSkladaniaRR:newParametr[0].okresSkladaniaRR
        });
    },
    updateParametr: function(id, parametr){
        Parametr.update({_id:id}, {$set: parametr}, {upsert: true});
    }
});