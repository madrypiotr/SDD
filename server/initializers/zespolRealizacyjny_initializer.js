Meteor.startup(function(){
    var ZR = {
        "_id": "jjXKur4qC5ZGPQkgN",
        "nazwa": TAPi18n.__('txv.ZR_PERSONS'),
        "zespol": [],
        "kwestie":[],
        "czyAktywny":true
    };

    if(aImplemTeam.find().count() == 0){
        aImplemTeam.insert({
            _id:ZR._id,
            nazwa:ZR.nazwa,
            zespol:ZR.zespol,
            kwestie:ZR.kwestie,
            czyAktywny:ZR.czyAktywny
        });
    }
});
