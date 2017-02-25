Meteor.methods({
    addZespolRealizacyjnyDraft: function (newZespol) {

        var id = ZespolRealizacyjnyDraft.insert({
            nazwa: newZespol[0].nazwa,
            zespol:newZespol[0].zespol,
            idZR:newZespol[0].idZR
        });
        return id;
    },
    removeZespolRealizacyjnyDraft:function(object){
        ZespolRealizacyjnyDraft.remove(object);
    },
    updateZespolRealizacyjnyDraft:function(id,data){
        var id = ZespolRealizacyjnyDraft.update({_id:id}, {$set: {nazwa: data.nazwa,zespol:data.zespol,idZR:data.idZR}}, {upsert: true});
        return id;
    },
    updateCzlonkowieZRDraft: function (id, czlonkowie) {
        var id = ZespolRealizacyjnyDraft.update(id, {$set: {zespol: czlonkowie}}, {upsert: true});
        return id;
    },
    updateCzlonkowieNazwaZRDraft: function (id, czlonkowie,nazwa) {
        var id = ZespolRealizacyjnyDraft.update(id, {$set: {zespol: czlonkowie,nazwa:nazwa}}, {upsert: true});
        return id;
    }
});
