Meteor.methods({
    addZespolRealizacyjny: function (newZespol) {
        return ZespolRealizacyjny.insert({
            nazwa: newZespol[0].nazwa,
            zespol: newZespol[0].zespol,
            kwestie: newZespol[0].kwestie,
            czyAktywny: newZespol[0].czyAktywny
        });
    },
    updateListKwesti: function (id, listKwestii) {
        return ZespolRealizacyjny.update(id, {
            $set: {kwestie: listKwestii}
        }, {upsert: true});
    },
    updateCzlonkowieZR: function (id, czlonkowie) {
        return ZespolRealizacyjny.update(id, {
            $set: {zespol: czlonkowie}
        }, {upsert: true});
    },
    updateCzlonkowieZRProtector: function (id, czlonkowie, protector) {
        return ZespolRealizacyjny.update(id, {
            $set: {zespol: czlonkowie, protector: protector}
        }, {upsert: true});
    },
    updateKwestieZR: function (id, kwestie) {
        return ZespolRealizacyjny.update(id, {
            $set: {kwestie: kwestie}
        }, {upsert: true});
    },
    updateKwestieZRChangeActivity: function (id, kwestie, czyAktywny) {
        return ZespolRealizacyjny.update(id, {
            $set: {kwestie: kwestie, czyAktywny: czyAktywny}
        }, {upsert: true});
    },
    removeZespolRealizacyjny: function (id) {
        return ZespolRealizacyjny.update(id, {
            $set: {czyAktywny: false}
        }, {upsert: true});
    }
});
