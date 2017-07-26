Meteor.methods({
    addZespolRealizacyjny: function (newTeam) {
        var id = ZespolRealizacyjny.insert({
            nazwa: newTeam[0].nazwa,
            zespol:newTeam[0].zespol,
            kwestie:newTeam[0].kwestie,
            czyAktywny:newTeam[0].czyAktywny
        });
        return id;
    },
    updateListKwesti:function (id, listKwestii) {
        var id = ZespolRealizacyjny.update(id, {$set: {kwestie: listKwestii}}, {upsert: true});
        return id;
    },
    updateCzlonkowieZR: function (id, czlonkowie) {
        var id = ZespolRealizacyjny.update(id, {$set: {zespol: czlonkowie}}, {upsert: true});
        return id;
    },
    updateCzlonkowieZRProtector: function (id, czlonkowie,protector) {
        var id = ZespolRealizacyjny.update(id, {$set: {zespol: czlonkowie,protector:protector}}, {upsert: true});
        return id;
    },
    updateKwestieZR:function (id, kwestie) {
        var id = ZespolRealizacyjny.update(id, {$set: {kwestie: kwestie}}, {upsert: true});
        return id;
    },
    updateKwestieZRChangeActivity:function (id, kwestie,czyAktywny) {
        var id = ZespolRealizacyjny.update(id, {$set: {kwestie: kwestie,czyAktywny:czyAktywny}}, {upsert: true});
        return id;
    },
    removeZespolRealizacyjny:function(id){
        var id = ZespolRealizacyjny.update(id, {$set: {czyAktywny: false}}, {upsert: true});
        return id;
    }
});
