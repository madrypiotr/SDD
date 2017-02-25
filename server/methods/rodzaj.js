Meteor.methods({
    addRodzaj: function (newRodzaj) {
        var id=Rodzaj.insert({
            idTemat: newRodzaj[0].idTemat,
            nazwaRodzaj: newRodzaj[0].nazwaRodzaj,
            czasDyskusji: newRodzaj[0].czasDyskusji,
            czasGlosowania: newRodzaj[0].czasGlosowania,
            kworum: newRodzaj[0].kworum
        });
        return id;
    },
    updateRodzaj: function (idRodzaj, rodzaj) {
        Rodzaj.update(idRodzaj, {$set: rodzaj}, {upsert: true});
    }
});
