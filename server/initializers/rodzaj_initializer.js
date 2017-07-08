Meteor.startup(function () {
    var rodzaj = {
        "_id": "qMqF9S9hjZFz4bRK7",
        "idTemat": "3TBYqrgpJiQQSDEbt",
        "nazwaRodzaj": TAPi18n.__('txv.ADOPT')
    };

    var rodzaj2= {
        "_id": "qMqF9S9hjZFz4bRK8",
        "idTemat": "3TBYqrgpJiQQSDEbt",
        "nazwaRodzaj": TAPi18n.__('txv.STATUTORY')
    };

    if (Rodzaj.find().count() == 0) {

        Rodzaj.insert({
            _id:rodzaj._id,
            idTemat: rodzaj.idTemat,
            nazwaRodzaj: rodzaj.nazwaRodzaj
        });

        Rodzaj.insert({
            _id:rodzaj2._id,
            idTemat: rodzaj2.idTemat,
            nazwaRodzaj: rodzaj2.nazwaRodzaj
        });
    }
});