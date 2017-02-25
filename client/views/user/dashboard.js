Template.adminTemplate.helpers({
    kwestieCount: function(){
        return Kwestia.find({czyAktywny: true}).count();
    }
});