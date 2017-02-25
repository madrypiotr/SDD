Meteor.methods({
    addRaportMethod: function(newRaport){
        var id=Raport.insert({
            idAutor:newRaport.idAutor,
            autorFullName:newRaport.autorFullName,
            dataUtworzenia:moment(newRaport.dataUtworzenia).format(),
            idKwestia:newRaport.idKwestia,
            idPost:newRaport.idPost,
            tytul:newRaport.tytul,
            opis:newRaport.opis,
            czyAktywny:true
        });
        Posts.update({_id:newRaport.idPost},{$set:{idRaport:id}});
        return id;
    }
});