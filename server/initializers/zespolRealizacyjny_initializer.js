Meteor.startup(function(){
    var ZR = {
        "_id": "jjXKur4qC5ZGPQkgN",
        "nazwa": TAPi18n.__('txv.ZR_PERSONS'),
        "zespol": [],
        "kwestie":[],
        "czyAktywny":true
    };

    if(ZespolRealizacyjny.find().count() == 0){
        ZespolRealizacyjny.insert({
            _id:ZR._id,
            nazwa:ZR.nazwa,
            zespol:ZR.zespol,
            kwestie:ZR.kwestie,
            czyAktywny:ZR.czyAktywny
        });
    }
});
