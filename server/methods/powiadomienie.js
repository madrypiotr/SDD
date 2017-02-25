Meteor.methods({
    addPowiadomienie: function (newPowiadomienie) {
        var id = Powiadomienie.insert({
            idOdbiorca: newPowiadomienie.idOdbiorca,
            dataWprowadzenia: newPowiadomienie.dataWprowadzenia,
            tytul: newPowiadomienie.tytul,
            powiadomienieTyp: newPowiadomienie.powiadomienieTyp,
            tresc: newPowiadomienie.tresc,
            idNadawca: newPowiadomienie.idNadawca,
            idKwestia:newPowiadomienie.idKwestia,
            kwestia:newPowiadomienie.kwestia,
            idUserDraft:newPowiadomienie.idUserDraft,
            uzasadnienie:newPowiadomienie.uzasadnienie,
            czyAktywny: true,
            zespol:newPowiadomienie.zespol,
            czyOdczytany:newPowiadomienie.czyOdczytany
        });
        return id;
    },
    setOdczytanePowiadomienie:function(id,czyOdczytany){
        Powiadomienie.update(id, {$set: {czyOdczytany: czyOdczytany}}, {upsert: true});
    },
    setOdczytaneAktywnoscPowiadomienie:function(id,czyOdczytany,czyAktywny){
        Powiadomienie.update(id, {$set: {czyOdczytany: czyOdczytany,czyAktywny:czyAktywny}}, {upsert: true});
    }
});