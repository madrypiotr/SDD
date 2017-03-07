getUpdateKwestiaRatingObject = function (ratingValue, object) {
    var glosujacyTab = object.glosujacy.slice();
    var wartoscPriorytetu = parseInt(object.wartoscPriorytetu);

    _.each(object.glosujacy, function (item) {
        if (item.idUser === Meteor.userId()) {
            wartoscPriorytetu -= item.value;
            glosujacyTab[object.glosujacy.indexOf(item)].value = ratingValue;
            wartoscPriorytetu += ratingValue;
        }
    });

    var kwestiaUpdate = [{
        wartoscPriorytetu: wartoscPriorytetu,
        glosujacy: glosujacyTab
    }];

    return kwestiaUpdate;
};

getOldValueOfUserVote = function (ratingValue, object) {
    var oldValue = 0;
    _.each(object.glosujacy, function (item) {
        if (item.idUser === Meteor.userId())
            oldValue = item.value;
    });
    return oldValue;
};
powolajZRFunction=function(idKwestia,idAktualnyZR) {
    var kwestia = Kwestia.findOne({_id: idKwestia});
    if (kwestia) {
        var zespolWybrany = ZespolRealizacyjny.findOne({_id: idAktualnyZR});
        if (zespolWybrany) {
            var myZR = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
            if (myZR) {
                var myNewZR = {
                    nazwa: zespolWybrany.nazwa,
                    zespol: zespolWybrany.zespol,
                    idZR:idAktualnyZR
                };
                Meteor.call('updateZespolRealizacyjnyDraft', myZR._id, myNewZR, function (error, ret) {
                    if (error) {
                        throwError(error.reason);
                    }
                    else {
                        $("#listZespolRealizacyjny").modal("hide");
                        $("#listZespolRealizacyjnyDouble").modal("hide");
                    }
                });
            }

        }
    }
};
isKwestiaGlosowana=function(idKwestia){
    var kwestia= Kwestia.findOne({_id:idKwestia});
    if(kwestia){
        return kwestia.status==KWESTIA_STATUS.GLOSOWANA ? "disabled" :"";
    }
    return "";
};
setInQueueToVoteMethod=function(kwestie){
    var tab=[];
    var tabKwestie = [];
    kwestie.forEach(function (item) {
        tabKwestie.push(item);
    });
    var arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[0].wartoscPriorytetu});
    if (arrayTheSameWartoscPrior.length >= 3) {
        var tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
        tab.push(tabKwestieSort[0]._id);
        tab.push(tabKwestieSort[1]._id);
        tab.push(tabKwestieSort[2]._id);
    }
    else if (arrayTheSameWartoscPrior.length == 2) {
        var tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
        tab.push(tabKwestieSort[0]._id);
        tab.push(tabKwestieSort[1]._id);
        //znajdz kolejny nizszy priorytet:usun z tablicy o tamtym priorytecie i posortuj na nowo
        tabKwestie= _.reject(tabKwestie,function(el){return el.wartoscPriorytetu==tabKwestieSort[0].wartoscPriorytetu});
        tabKwestie =( _.sortBy(tabKwestie, "wartoscPriorytetu")).reverse();
        arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[0].wartoscPriorytetu});
        tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
        tab.push(tabKwestieSort[0]._id);
    }
    else {//nie powtarzaja sie
        tab.push(tabKwestie[0]._id);
        arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[1].wartoscPriorytetu});
        if (arrayTheSameWartoscPrior.length >= 2) {//jezeli 2 i 3 sie powtarzaja,to posortuj i wrzuć
            tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
            tab.push(tabKwestieSort[0]._id);
            tab.push(tabKwestieSort[1]._id);
        }
        else{//2 i 3 sa inne
            tab.push(tabKwestie[1]._id);
            tab.push(tabKwestie[2]._id);
        }
    }
    return tab;
};
rewriteZRMembersToListMethod=function(zespolRealizacyjny,newKwestia){//przpisanie ,gdy idzie do kosza (i ma ZrDraft)
    var czlonkowieZespolu = [];
    _.each(zespolRealizacyjny.zespol, function (idUser) {
        var user = Users.findOne({_id: idUser});
        czlonkowieZespolu.push(user.profile.firstName + " " + user.profile.lastName);
    });
    var obj={
        nazwa:zespolRealizacyjny.nazwa,
        czlonkowie:czlonkowieZespolu
    };
    Meteor.call("addConstZR", newKwestia._id, obj, function (error) {
        if (error)
            throwError(error.reason);
    });
};
//przpisanie ,gdy idzie do kosza a ma ZR
manageZRMethod=function(newKwestia){
    var zespolRealizacyjny = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny});
    if (zespolRealizacyjny.kwestie.length > 0) {
        //wypisz mnie
        var kwestie = _.reject(zespolRealizacyjny.kwestie, function (kwestiaId) {
            return kwestiaId == newKwestia._id
        });
        //jezeli bylem tylko ja,set false, o ile to nie jest zr ds osób
        if(kwestie.length==0 && zespolRealizacyjny._id!=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"})._id){
            Meteor.call("updateKwestieZRChangeActivity", zespolRealizacyjny._id, kwestie,false, function (error) {
                if (error)
                    throwError(error.reason);
                else
                    rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
            });
        }
        else {
            Meteor.call("updateKwestieZR", zespolRealizacyjny._id, kwestie, function (error) {
                if (error)
                    throwError(error.reason);
                else
                    rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
            });
        }
    }
    else {//jezeli nie ma zadnych kwestii,ustaw na false,
        if(zespolRealizacyjny._id!=ZespolRealizacyjny.findOne()._id){
            Meteor.call('removeZespolRealizacyjny', zespolRealizacyjny._id, function (error) {
                if (error)
                    throwError(error.reason);
                else
                    rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
            });
        }
        else
            rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
    }
};
updateListKwestieMethod=function(ZR,kwestiaId){
    var kwestia=Kwestia.findOne({_id:kwestiaId});
    if(kwestia) {
        var listKwestii = ZR.kwestie.slice();
        listKwestii.push(kwestiaId);
        Meteor.call('updateListKwesti', ZR._id, listKwestii, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error(ERROR + error.reason);
                else
                    throwError(error.reason);

            }
            else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
                Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, ZR._id);
            }
        });
    }
};
createNewZRMethod=function(zrDraft,kwestia){
    var arrayKwestie = [];
    arrayKwestie.push(kwestia._id);
    var newZR = [{
        nazwa: zrDraft.nazwa,
        zespol: zrDraft.zespol,
        kwestie: arrayKwestie,
        czyAktywny: true
    }];
    Meteor.call('addZespolRealizacyjny', newZR, function (error, ret) {
        if (error) {
            if (typeof Errors === "undefined")
                Log.error(ERROR + error.reason);
            else
                throwError(error.reason);

        }
        else {//zaktualizuj idZespoluRealizacyjnego w tej kwestii
            var idZR = ret;
            Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, idZR);
        }
    });
};
nadawanieNumeruUchwalyMethod = function(dataRealizacji) {

    var numerUchw = 1;
    var kwestieRealizowane = Kwestia.find({czyAktywny: true, numerUchwaly: !null});

    kwestieRealizowane.forEach(function (kwestiaRealizowana) {

        if(kwestiaRealizowana.dataRealizacji.toDateString() == dataRealizacji.toDateString())
            numerUchw++
    });

    return numerUchw;
};

