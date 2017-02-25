Meteor.methods({
    addTemat: function(newTemat) {
        var id=Temat.insert({
            nazwaTemat: newTemat[0].nazwaTemat,
            opis: newTemat[0].opis
        });

        return id;
    },
    updateTemat: function(tematId, temat){
        Temat.update(tematId, {$set: temat}, {upsert:true});
    }
});