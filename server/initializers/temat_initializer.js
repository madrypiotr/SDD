Meteor.startup(function(){
    var temat =
    {
        "_id": "3TBYqrgpJiQQSDEbt",
        "nazwaTemat": TXV.ORGANIZATIONAL,
        "opis": TXV.INTERNAL_AFFAIRS
    };

    if(Temat.find().count() == 0){

        Temat.insert({
            _id:temat._id,
            nazwaTemat: temat.nazwaTemat,
            opis: temat.opis
        });
    }
});