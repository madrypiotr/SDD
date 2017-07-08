Meteor.startup(function(){
    var temat =
    {
        "_id": "3TBYqrgpJiQQSDEbt",
        "nazwaTemat": TAPi18n.__('txv.ORGANIZATIONAL'),
        "opis": TAPi18n.__('txv.INTERNAL_AFFAIRS')
    };

    if(Temat.find().count() == 0){

        Temat.insert({
            _id:temat._id,
            nazwaTemat: temat.nazwaTemat,
            opis: temat.opis
        });
    }
});