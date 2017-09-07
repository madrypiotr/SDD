Meteor.methods({
    addImplemTeamDraft: function (newZespol) {
        return ImplemTeamDraft.insert({
            nazwa: newZespol[0].nazwa,
            zespol: newZespol[0].zespol,
            idZR: newZespol[0].idZR
        });
    },
    removeImplemTeamDraft: function (object) {
        ImplemTeamDraft.remove(object);
    },
    updateImplemTeamDraft: function (id, data) {
        return ImplemTeamDraft.update({_id: id}, {
            $set: {nazwa: data.nazwa, zespol: data.zespol, idZR: data.idZR}
        }, {upsert: true});
    },
    updateCzlonkowieZRDraft: function (id, czlonkowie) {
        return ImplemTeamDraft.update(id, {
            $set: {zespol: czlonkowie}
        }, {upsert: true});
    },
    updateCzlonkowieNazwaZRDraft: function (id, czlonkowie, nazwa) {
        return ImplemTeamDraft.update(id, {
            $set: {zespol: czlonkowie, nazwa: nazwa}
        }, {upsert: true});
    }
});
