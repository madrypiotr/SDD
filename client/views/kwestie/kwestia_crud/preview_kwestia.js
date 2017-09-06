Template.previewKwestia.rendered = function () {
    document.getElementById('save').disabled = false;
};
Template.previewKwestia.helpers({
    getTematName: function (id) {
        return Temat.findOne({_id: id}).nazwaTemat;
    },
    getRodzajName: function (id) {
        return Rodzaj.findOne({_id: id}).nazwaRodzaj;
    },
    temat: function () {
        var sess = Session.get('kwestiaPreview');
        var t = null;
        if (sess) {
            t = firstLetterToUpperCase(sess.temat);
            return t ? t : null;
        }
    },
    rodzaj: function () {
        var sess = Session.get('kwestiaPreview');
        var t = null;
        if (sess) {
            t = firstLetterToUpperCase(sess.rodzaj);
            return t ? t : null;
        }
    }
});

Template.previewKwestia.events({
    'click #cancel': function () {
        Session.set('kwestiaPreview', null);
        Router.go('listKwestia');
    },
    'click #save': function (e) {
        e.preventDefault();

        document.getElementById('save').disabled = true;

        var kwestie = Kwestia.find({czyAktywny: true});
        var kwestia = Session.get('kwestiaPreview');

        var flag = false;
        kwestie.forEach(function (item) {
            if (item.kwestiaNazwa.trim().toUpperCase() == kwestia.kwestiaNazwa.trim().toUpperCase()) {
                flag = true;
            }
        });
        if (flag == false) {
            var temat = kwestia.temat;
            var rodzaj = kwestia.rodzaj;

            var idParentKwestii = Session.get('idKwestia');
            var isOption = false;


            kwestia.idParent ? isOption = true : isOption = false;
            setValue(temat, rodzaj, isOption, kwestia);
        } else
            bootbox.alert(TAPi18n.__('txv.GIVEN_ISSUE_EXISTS'), function () { });
    }
});
setValue = function (temat,rodzaj,isOption,kwestia) {
    var idTemat = null;
    var idRodzaj = null;

    var foundIdTemat = null;
    Temat.find({ }).forEach(function (item) {
        if (item.nazwaTemat.trim().toLowerCase() == temat.trim().toLowerCase()) {
            foundIdTemat = item._id;
            return;
        }
    });

    if (foundIdTemat == null) {
        temat = firstLetterToUpperCase(temat);

        var nowyTemat = [{
            nazwaTemat:temat,
            opis:''
        }];
        Meteor.call('addTemat', nowyTemat, function (error,ret) {
            if (error) {
                if (typeof Errors === 'undefined')
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else
                    throwError(error.reason);

            } else {
                rodzaj = firstLetterToUpperCase(rodzaj);
                var newRodzaj = [{
                    idTemat:ret,
                    nazwaRodzaj: rodzaj,
                    czasDyskusji:7,
                    czasGlosowania:24
                }];
                idTemat = ret;

                Meteor.call('addRodzaj', newRodzaj, function (error,ret) {
                    if (error) {
                        if (typeof Errors === 'undefined')
                            Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                        else
                            throwError(error.reason);

                    } else {
                        idRodzaj = ret;
                        addKwestia(idTemat,idRodzaj,isOption,kwestia);
                    }
                });
            }
        });
    } else {
        var foundIdRodzaj = null;
        idTemat = foundIdTemat;
        Rodzaj.find({ }).forEach(function (item) {
            if (item.idTemat == foundIdTemat) {
                if (item.nazwaRodzaj.trim().toLowerCase() == rodzaj.trim().toLowerCase()) {
                    idTemat = item.idTemat;
                    idRodzaj = item._id;
                    foundIdRodzaj = item._id;
                }
            }
        });
        if (foundIdRodzaj == null) {

            rodzaj = firstLetterToUpperCase(rodzaj);
            var newRodzaj = [{
                idTemat:idTemat,
                nazwaRodzaj: rodzaj,
                czasDyskusji:7,
                czasGlosowania:24
            }];
            Meteor.call('addRodzaj', newRodzaj, function (error,ret) {
                if (error) {
                    if (typeof Errors === 'undefined')
                        Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                    else
                        throwError(error.reason);

                } else {
                    idRodzaj = ret;
                    addKwestia(idTemat,idRodzaj,isOption,kwestia);
                }
            });
        } else {
            addKwestia(idTemat,idRodzaj,isOption,kwestia);
        }
    }

};

firstLetterToUpperCase = function (text) {
    var firstLetter = text.charAt(0).toUpperCase();
    return text.replace(text.charAt(0),firstLetter);
};
addKwestia = function (idTemat,idRodzaj,isOption,kwestia) {
    var status = KWESTIA_STATUS.DELIBEROWANA;
    var newKwestia = [{
        idUser: Meteor.userId(),
        dataWprowadzenia: new Date(),
        kwestiaNazwa: kwestia.kwestiaNazwa,
        wartoscPriorytetu: 0,
        wartoscPriorytetuWRealizacji: 0,
        idTemat: idTemat,
        idRodzaj: idRodzaj,
        dataDyskusji: kwestia.dataDyskusji,
        dataGlosowania: kwestia.dataGlosowania,
        dataRealizacji: null,
        czyAktywny: true,
        status: status,
        krotkaTresc: kwestia.krotkaTresc,
        szczegolowaTresc: kwestia.szczegolowaTresc,
        isOption: false,
        sugerowanyTemat: kwestia.sugerowanyTemat,
        sugerowanyRodzaj: kwestia.sugerowanyRodzaj,
        typ:kwestia.typ
    }];
    Meteor.call('addKwestia', newKwestia, function (error, ret) {
        if (error) {
            if (typeof Errors === 'undefined')
                Log.error(TAPi18n.__('txv.ERROR') + error.reason);
            else {
                throwError(error.reason);
            }
        } else {
            Session.set('kwestiaPreview', null);
            Meteor.call('sendEmailAddedIssue', ret, getUserLanguage(), function (error) {
                if (error) {
                    var emailError = {
                        idIssue: ret,
                        type: NOTIFICATION_TYPE.NEW_ISSUE
                    };
                    Meteor.call('addEmailError', emailError);
                }
            });
            addPowiadomienieIssueFunction(ret,newKwestia[0].dataWprowadzenia,NOTIFICATION_TYPE.NEW_ISSUE,'');
            var text = TAPi18n.__('txv.LACK_OF_ACTIVITY');
            addPowiadomienieIssueFunction(ret,newKwestia[0].dataWprowadzenia,NOTIFICATION_TYPE.ISSUE_NO_PRIORITY,text);
            Router.go('administracjaUserMain');
        }
    });
};

addPowiadomienieIssueFunction = function (idKwestia,dataWprowadzenia,typ,text) {
    var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
    users.forEach(function (user) {
        var newPowiadomienie = {
            idOdbiorca: user._id,
            idNadawca: null,
            dataWprowadzenia: dataWprowadzenia,
            tytul: '',
            powiadomienieTyp: typ,
            tresc: text,
            idKwestia:idKwestia,
            czyAktywny: true,
            czyOdczytany: false
        };
        Meteor.call('addPowiadomienie',newPowiadomienie,function (error) {
            if (error)
                throwError(error.reason);
        });
    });

};
