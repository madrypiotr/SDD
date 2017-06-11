/*
 Stąd można będzie wnioskować powrót Kwestii do deliberacji IDENTYCZNIE, jak się odsyła z innych paneli do Archiwum.
 Przycisk [do Deliberacji] spowoduje powstanie specjalnego komentarza z dołączonym uzasadnieniem...
  -> TO DO -> Zrobić mechanizm sprawdzający parametry potrzebne do przeniesienia Kwestii z archiwum do wykazu.

 Przycisk  [do Deliberacji] nie może się pokazywać dla Kwestii o statusie "hibernowana" (GOTOWE), który to status również (tylko Kwestie-Opcje) lokuje w Archiwum.
 Zamiast tego przycisku proszę ulokować tam:  [Zobacz Realizację] (GOTOWE)
 A więc z hibernowanych można będzie jedynie odsyłać do Realizacji Kwestii zwycięskiej w tej grupie Opcji.
 Hibernowanych Kwestii  NIE MOŻNA PRIORYTETOWAĆ , ale można priorytetować ich komentarze oraz odniesienia,
 jak też dodawać Komentarze i odniesienia... (GOTOWE)
 Jedynie po degradacji ich "siostry" z Realizacji - automatycznie związane Opcje są uwalniane z hibernacji i
 wskakują do Deliberacji (nadal jako grupa Opcji), a zdegradowana Kwestia-Opcja (zależnie od decyzji) - do Archiwum lub Kosza.
  -> TO DO
 Kwestię będącą w Archiwum NIE MOŻNA PRIORYTETOWAĆ (GOTOWE), natomiast jej dotychczasowy priorytet powinien być zachowany
 (zamrożony na czas przebywania w Archiwum).
 O jej powrocie do Deliberacji może zdecydować jedynie priorytetowanie specjalnego komentarza. (GOTOWE)
 Zwykła dyskusja, komentarze i odniesienia mogą funkcjonować (a nawet powinny),
 czyli w Archiwum można dyskutować, priorytetować komentarze i odniesienia.
* */

Template.informacjeKwestiaArchiwum.events({
    'click #doKosza': function (e) {
        e.preventDefault();
        var idKwestii = this._id;
        Session.set("idkwestiiKosz", this._id);
        var item = Posts.findOne({idKwestia: idKwestii, postType: "kosz"});
        if (item) {
            $('html, body').animate({
                scrollTop: $(".doKoszaClass").offset().top
            }, 600);
        }
        else
            $("#uzasadnijWyborKosz").modal("show");
    },
    'click #doWK': function (e) {
        e.preventDefault();
        var idKwestii = this._id;
        Session.set("idkwestiiWK", this._id);
        var item = Posts.findOne({idKwestia: idKwestii, postType: "deliberacja"});
        if (item) {
            $('html, body').animate({
                scrollTop: $(".doWKClass").offset().top
            }, 600);
        }
        else
            $("#uzasadnijWyborWK").modal("show");
    },
    'click #priorytetButton': function (e) {

        var ratingValue = parseInt(e.target.value);
        var kwestia = Kwestia.findOne({_id: this._id});
        var oldValue = getOldValueOfUserVote(ratingValue, kwestia);
        var kwestiaUpdate = getUpdateKwestiaRatingObject(ratingValue, kwestia);

        Meteor.call('updateKwestiaRating', kwestia._id, kwestiaUpdate, function (error, ret) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }
            else {
                var newValue = ratingValue + getUserRadkingValue(kwestia.idUser) - oldValue;
                Meteor.call('updateUserRanking', kwestia.idUser, newValue, function (error) {
                    if (error) {
                        if (typeof Errors === "undefined")
                            Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                        else
                            throwError(error.reason);
                    }
                });
            }
        });
    }
});
Template.informacjeKwestiaArchiwum.helpers({
    ifIsHibernowana: function () {
        var k = this;
        if (k.status == KWESTIA_STATUS.HIBERNOWANA)
            return true;
        return false;
    },
    ifHasOpcje: function () {
        var kwestiaGlownaId = this._id;
        var k = Kwestia.find({idParent: kwestiaGlownaId, isOption: true}).fetch();
        if (k) return true;
        else return false;
    },
    isAdmin: function () {
        return IsAdminUser();
    },
    kwestiaTypParamChange:function(){
        return this.typ=KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true :false;
    },
    opcje: function () {
        var kwestiaGlownaId = Session.get("idKwestia");
        var op = Kwestia.find({idParent: kwestiaGlownaId}).fetch();
        if (op) return true;
        else return false;
    },
    thisKwestia: function () {
        var kw = Kwestia.findOne({_id: this._id});
        if (kw.isOption) Session.set("idKwestia", kw.idParent);
        else Session.set("idKwestia", this._id)
    },
    mojPiorytet: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            var g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser) {
                    return g[i].value;
                }
            }
        }
    },
    mojPriorytetZero: function () {
        var currentKwestiaId = this._id;
        var kwestia = Kwestia.findOne(currentKwestiaId);
        if (kwestia) {
            var g = kwestia.glosujacy;
            for (var i = 0; i < g.length; i++) {
                if (Meteor.userId() == g[i].idUser && g[i].value == 0)
                    return true;
                else return false;
            }
        }
    },
    glosujacyCount: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        if (tab) {
            var liczba = tab.glosujacy.length;
            return liczba;
        }
    },
    nazwa: function () {
        var currentKwestiaId = this._id;
        var tab = Kwestia.findOne(currentKwestiaId);
        if (tab) return tab;
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    },
    rodzajNazwa: function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    },
    date: function () {
        if (this.dataWprowadzenia)
            return moment(this.dataWprowadzenia).format("DD-MM-YYYY, HH:mm");
    },
    dateStartVote: function () {
        if (this.startGlosowania)
            return moment(this.startGlosowania).format("DD-MM-YYYY, HH:mm");
    },
    dateFinishVote: function () {
        if (this.dataGlosowania)
            return moment(this.dataGlosowania).format("DD-MM-YYYY, HH:mm");
    },
    isSelected: function (number) {
        var flag = false;
        var kwestie = Kwestia.find({'glosujacy.idUser': Meteor.userId(), idParent: Template.instance().data._id});
        kwestie.forEach(function (kwestia) {
            _.each(kwestia.glosujacy, function (item) {
                if (item.idUser == Meteor.userId() && item.value == number)
                    flag = true;
            });
        });

        return flag ? "disabled" : "";
    },
    isAvailable: function () {
        var i = 0;
        var kwestie = Kwestia.find({
            'glosujacy.idUser': Meteor.userId(),
            idParent: Template.instance().data._id
        }).fetch();
        var globalCounter = 0;
        kwestie.forEach(function (kwestia) {
            _.each(kwestia.glosujacy, function (item) {
                if (item.idUser == Meteor.userId()) {
                    globalCounter += 1;
                    if (item.value == 0)
                        i = i + 1;
                }
            });
        });
        return i == globalCounter ? "disabled" : "";
    }
});
