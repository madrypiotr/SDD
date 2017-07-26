Template.managePriorities.helpers({
    priority: function (priorytet) {
        if (priorytet) {
            if (priorytet > 0) {
                priorytet = "+" + priorytet;
                return priorytet;
            }
            else return priorytet;
        }
        else return 0;
    },
    isSelected: function (number, idParent, glosujacy, status, idKwestia) {
        if (!Meteor.userId())
            return "disabled";
        if (Meteor.user().profile.userType != USERTYPE.CZLONEK)
            return "disabled";
        var kwestia = Kwestia.findOne({_id: idKwestia});
        var flag = false;
        if (kwestia) {
            if (kwestia.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {
                var globalParams = ParametrDraft.findOne({czyAktywny: true});
                if (globalParams) {
                    var kwestie = Kwestia.find({
                        czyAktywny: true,
                        'glosujacy.idUser': Meteor.userId(),
                        typ: KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE,
                        idParametr: globalParams._id
                    });
                }
            }
            else
                var kwestie = Kwestia.find({
                    czyAktywny: true,
                    'glosujacy.idUser': Meteor.userId(),
                    idParent: idParent
                });
        }
        if (status == KWESTIA_STATUS.REALIZOWANA) {
            var kwestia = Kwestia.findOne({_id: idKwestia});
            if (kwestia) {
                var glosujacyUser = _.findWhere(kwestia.glosujacyWRealizacji, {'idUser': Meteor.userId()});
                if (glosujacyUser) {
                    if (glosujacyUser.value == number) {
                        flag = true;
                    }
                    else flag = false;
                }
                else
                    flag = false;
            }
        }
        else {
            kwestie.forEach(function (kwestiaItem) {
                var array = [];
                var tabGlosujacych = glosujacy;
                for (var j = 0; j < kwestiaItem.glosujacy.length; j++) {
                    if (kwestiaItem.glosujacy[j].idUser == Meteor.userId()) {
                        if (kwestiaItem.glosujacy[j].value == number) {
                            flag = true;
                        }
                    }
                }
            });
        }
        return flag == true ? "disabled" : "";
    },
    isUserOrDoradcaLogged: function () {
        if (!Meteor.userId())
            return "disabled";
        return Meteor.user().profile.userType != USERTYPE.CZLONEK ? "disabled" : "";
        return "";
    },
    koszZrealizowanaArchiwum: function (czyAktywny, status) {
        return czyAktywny == false || status == KWESTIA_STATUS.ZREALIZOWANA || status == KWESTIA_STATUS.ARCHIWALNA || status == KWESTIA_STATUS.OCZEKUJACA
        || status == KWESTIA_STATUS.HIBERNOWANA ? true : false;
    },
    isRealizowana: function (status) {
        return status == KWESTIA_STATUS.REALIZOWANA ? true : false;
    }
});

Template.managePriorities.events({
    'click #priorytetButton': function (e) {
        var aktualnaKwestiaId = Session.set("idK", this._id);
        var u = Meteor.userId();
        var ratingValue = parseInt(e.target.value);
        var ratingKwestiaId = e.target.name;
        var kwestia = Kwestia.findOne({_id: ratingKwestiaId});

        var object = {
            idUser: Meteor.userId(),
            value: ratingValue
        };
        if (kwestia.status == KWESTIA_STATUS.REALIZOWANA) {
            managePriorityKwestiaRealizowana(ratingKwestiaId, kwestia, object, ratingValue);

        }
        else {
            managePriorityKwestiaDelibGlosowana(ratingKwestiaId, kwestia, object, ratingValue);

        }
    }
});
managePriorityKwestiaRealizowana = function (ratingKwestiaId, kwestia, object, ratingValue) {
    var wartoscPriorytetuWRealizacji = kwestia.wartoscPriorytetuWRealizacji;
    var glosujacyWRealizacji = kwestia.glosujacyWRealizacji;
    var myGlos = _.findWhere(glosujacyWRealizacji, {'idUser': Meteor.userId()});

    if (myGlos) {
        wartoscPriorytetuWRealizacji -= myGlos.value;
        wartoscPriorytetuWRealizacji += ratingValue;
        var newGlosujacyWRealiz = _.reject(glosujacyWRealizacji, function (el) {
            return el.idUser == Meteor.userId()
        });
        object.value = ratingValue;
        glosujacyWRealizacji = newGlosujacyWRealiz;
        glosujacyWRealizacji.push(object);
    }
    else {
        wartoscPriorytetuWRealizacji += ratingValue;
        glosujacyWRealizacji.push(object);
    }
    var kwestiaUpdate = [{
        wartoscPriorytetuWRealizacji: wartoscPriorytetuWRealizacji,
        glosujacyWRealizacji: glosujacyWRealizacji
    }];
    Meteor.call('UpdateIssueInImplemRating', ratingKwestiaId, kwestiaUpdate, function (error, ret) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error(TAPi18n.__('txv.ERROR') + error.reason);
            else
                throwError(error.reason);
        }
    });
};

managePriorityKwestiaDelibGlosowana = function (ratingKwestiaId, kwestia, object, ratingValue) {
    var wartoscPriorytetu = parseInt(kwestia.wartoscPriorytetu);
    var parent = this.idParent;
    var kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: parent});
    var glosujacyTab = kwestia.glosujacy;

    var flag = false;
    if (kwestieOpcje.count() > 0) {
        for (var i = 0; i < kwestieOpcje.length; i++) {
            for (var j = 0; j < kwestieOpcje[i].glosujacy.length; j++) {
                var user = kwestieOpcje[i].glosujacy[j].idUser;
                var oddanyGlos = kwestieOpcje[i].glosujacy[j].value;
                if (user == Meteor.userId()) {
                    if (oddanyGlos == ratingValue) {
                        return false;
                    }
                }
            }
        }
    }
    var oldValue = 0;
    for (var i = 0; i < kwestia.glosujacy.length; i++) {
        if (kwestia.glosujacy[i].idUser === Meteor.userId()) {
            flag = false;
            oldValue = glosujacyTab[i].value;
            wartoscPriorytetu -= glosujacyTab[i].value;
            glosujacyTab[i].value = ratingValue;
            wartoscPriorytetu += glosujacyTab[i].value;
        }
    }

    var kwestiaUpdate = [{
        wartoscPriorytetu: wartoscPriorytetu,
        glosujacy: glosujacyTab
    }];
    Meteor.call('updateIssueRating', ratingKwestiaId, kwestiaUpdate, function (error, ret) {
        if (error) {
                    if (typeof Errors === "undefined")
                        Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                    else {
                        throwError(error.reason);
                    }
                } else {
                    var astatement = TAPi18n.__('txv.GIVING_PRIORITY') + ratingValue;
                    Notifications.success("", astatement, {timeout: 3000});

        }
    });
};
