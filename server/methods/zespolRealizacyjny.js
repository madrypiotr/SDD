Meteor.methods({
    addaImplemTeam: function (newZespol) {
        var id = aImplemTeam.insert({
            nazwa: newZespol[0].nazwa,
            zespol:newZespol[0].zespol,
            kwestie:newZespol[0].kwestie,
            czyAktywny:newZespol[0].czyAktywny
        });
        return id;
    },
    updateListKwesti:function (id, listKwestii) {
        var id = aImplemTeam.update(id, {$set: {kwestie: listKwestii}}, {upsert: true});
        return id;
    },
    updateCzlonkowieZR: function (id, czlonkowie) {
        var id = aImplemTeam.update(id, {$set: {zespol: czlonkowie}}, {upsert: true});
        return id;
    },
    updateCzlonkowieZRProtector: function (id, czlonkowie,protector) {
        var id = aImplemTeam.update(id, {$set: {zespol: czlonkowie,protector:protector}}, {upsert: true});
        return id;
    },
    updateKwestieZR:function (id, kwestie) {
        var id = aImplemTeam.update(id, {$set: {kwestie: kwestie}}, {upsert: true});
        return id;
    },
    updateKwestieZRChangeActivity:function (id, kwestie,czyAktywny) {
        var id = aImplemTeam.update(id, {$set: {kwestie: kwestie,czyAktywny:czyAktywny}}, {upsert: true});
        return id;
    },
    removeaImplemTeam:function(id){
        var id = aImplemTeam.update(id, {$set: {czyAktywny: false}}, {upsert: true});
        return id;
    }
});
