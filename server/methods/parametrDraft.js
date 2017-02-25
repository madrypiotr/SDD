Meteor.methods({
    addParametrDraft: function(newParametr) {
        var id = ParametrDraft.insert({
            dataWprowadzenia: new Date(),
            nazwaOrganizacji: newParametr.nazwaOrganizacji,
            terytorium: newParametr.terytorium,
            kontakty: newParametr.kontakty,
            regulamin: newParametr.regulamin,
            voteDuration:newParametr.voteDuration,
            voteQuantity:newParametr.voteQuantity,
            czasWyczekiwaniaKwestiiSpecjalnej:newParametr.czasWyczekiwaniaKwestiiSpecjalnej,
            addIssuePause:newParametr.addIssuePause,
            addCommentPause:newParametr.addCommentPause,
            addReferencePause:newParametr.addReferencePause,
            okresSkladaniaRR:newParametr.okresSkladaniaRR,
            czyAktywny:true
        });
        return id;
    },
    setActivityParametrDraft:function(id,czyAktywny){
        ParametrDraft.update(id, {$set: {czyAktywny: czyAktywny}}, {upsert: true});
    }
});