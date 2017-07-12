/**
 * Created by Bartłomiej Szewczyk on 2015-08-31.

Badanie zmian w postach, zespołach i kwestii w celu sprawdzenia czy kwestia powinna zmienić status z:
 deliberowana na glosowana
 glosowana na realizowana
 glosowana na archiwalna
 */

Meteor.startup(function(){
    var globalParamsDraft=ParametrDraft.find();
    globalParamsDraft.observe({
        added:function(newParam){
            var params=ParametrDraft.find({czyAktywny:true}, {sort: {dataWprowadzenia:-1}});
            if(params.count()>1){
                var issue=Kwestia.findOne({idParametr:newParam._id});
                if(issue)
                    Meteor.call("removeKwestia",issue._id);
                Meteor.call("setActivityParametrDraft",newParam._id,false);
            }
        }
    });

    var kwestie = Kwestia.find({
        status: {
            $in: [
                KWESTIA_STATUS.DELIBEROWANA,
                KWESTIA_STATUS.GLOSOWANA,
                KWESTIA_STATUS.REALIZOWANA,
                KWESTIA_STATUS.ADMINISTROWANA,
                KWESTIA_STATUS.ZREALIZOWANA,
                KWESTIA_STATUS.OSOBOWA
            ]
        }
    });

    kwestie.observe({
        changedAt: function(newKwestia, oldKwestia, atIndex) {
            var kworum = liczenieKworumZwykle();
            var usersCount = newKwestia.glosujacy.length;
            var ZRDraft=null;
            var zespolCount=null;
            if(newKwestia.idZespolRealizacyjny) {
                ZRDraft = ZespolRealizacyjnyDraft.findOne({_id: newKwestia.idZespolRealizacyjny});
                if(ZRDraft)
                    zespolCount = ZRDraft.zespol.length;
                else {
                    ZRDraft = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny});
                    if(ZRDraft)
                        zespolCount = ZRDraft.zespol.length;
                    else {
                        if(newKwestia.czyAktywny==false)
                            zespolCount = newKwestia.zespol.czlonkowie.length;
                    }
                }
            }
            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && newKwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE && newKwestia.status==KWESTIA_STATUS.ADMINISTROWANA) {
                moveKwestiaToGlosowana(newKwestia);
            }

            if(newKwestia.wartoscPriorytetu > 0 && usersCount >= kworum && zespolCount >= 3 && newKwestia.status != KWESTIA_STATUS.REALIZOWANA){
                if(newKwestia.status == KWESTIA_STATUS.DELIBEROWANA){
                    moveKwestiaToGlosowana(newKwestia);
                }
                else if(newKwestia.status==KWESTIA_STATUS.OSOBOWA && (newKwestia.typ==KWESTIA_TYPE.ACCESS_DORADCA || newKwestia.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY)){
                    moveKwestiaToGlosowana(newKwestia);
                }
                else if (newKwestia.status == KWESTIA_STATUS.OCZEKUJACA){
                   if(newKwestia.isAnswerPositive==true){
                        }
                }
            }

            if(newKwestia.status == KWESTIA_STATUS.REALIZOWANA && newKwestia.wartoscPriorytetuWRealizacji < ((-1)*newKwestia.wartoscPriorytetu) && newKwestia.czyAktywny==true){
                Meteor.call('removeKwestiaSetReason', newKwestia._id,KWESTIA_ACTION.NEGATIVE_PRIORITY,function(error) {
                    if(!error) {
                        if (newKwestia.idZespolRealizacyjny) {
                            manageZR(newKwestia);
                        }
                    }
                    else
                        throwError(error.reason);
                });

            }
            if(oldKwestia.status != newKwestia.status){
                if(oldKwestia.status == KWESTIA_STATUS.REALIZOWANA && (newKwestia.status == KWESTIA_STATUS.ZREALIZOWANA || newKwestia.status == KWESTIA_STATUS.ARCHIWALNA)){
                    unhibernateKwestieOpcje(newKwestia);
                }

                //sprawdzenie czy jakas kwestia opuściła głosowanie,jeśli tak,wpuść inne(zrealizowana dla param glob)
                if(oldKwestia.status == KWESTIA_STATUS.GLOSOWANA &&
                    (newKwestia.status==KWESTIA_STATUS.ZREALIZOWANA ||
                    newKwestia.status==KWESTIA_STATUS.REALIZOWANA ||
                    newKwestia.status==KWESTIA_STATUS.HIBERNOWANA)){

                    var kwestie = Kwestia.find(
                        {   status: {
                            $in: [
                                KWESTIA_STATUS.DELIBEROWANA,
                                KWESTIA_STATUS.ADMINISTROWANA,
                                KWESTIA_STATUS.OSOBOWA
                            ]
                        }
                        },
                        {wartoscPriorytetu: {$gt: 0}},
                        {sort: {wartoscPriorytetu: -1, dataWprowadzenia: 1}});

                    var arrayKwestie=[];
                    var idParent=oldKwestia.idParent;
                    kwestie.forEach(function (kwestia) {
                        var condtion=null;
                        if(kwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
                            condtion=liczenieKworumZwykle();
                        else {
                            var rodzaj=Rodzaj.findOne({_id:kwestia.idRodzaj});
                            if(rodzaj.rodzajNazwa=="Statutowe")
                            condtion=liczenieKworumStatutowe();
                            else condtion=liczenieKworumZwykle();
                        }
                        if(kwestia.glosujacy.length>=condtion) {
                            if (kwestia.idZespolRealizacyjny) {
                                var zespol = ZespolRealizacyjny.findOne({_id: kwestia.idZespolRealizacyjny});
                                if (!zespol) {
                                    zespol = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
                                }
                                if (zespol.zespol.length >= 3)
                                    arrayKwestie.push(kwestia);
                            }
                            else
                                arrayKwestie.push(kwestia);
                        }
                    });

                    if(arrayKwestie.length>0) {
                        arrayKwestie = _.sortBy(arrayKwestie, "wartoscPriorytetu");
                        arrayKwestie.reverse();

                        var kwestieGlosowane=Kwestia.find({status:KWESTIA_STATUS.GLOSOWANA,czyAktywny:true});
                        var tab=null;
                        if(kwestieGlosowane.count()==0) {
                            tab = setInQueueToVote(arrayKwestie,arrayKwestie.length);
                        }
                        else if(kwestieGlosowane.count()==1){
                            tab= _.first(setInQueueToVote(arrayKwestie,arrayKwestie.length),2);
                        }
                        else{
                            tab= _.first(setInQueueToVote(arrayKwestie,1),1);
                        }
                        _.each(tab,function(kwestiaId){
                            var kwestia=Kwestia.findOne({_id:kwestiaId});
                            if(kwestia){
                                if(kwestia.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
                                    moveKwestiaToGlosowana(kwestia);
                                else {
                                    var zr = ZespolRealizacyjnyDraft.findOne({_id: arrayKwestie[0].idZespolRealizacyjny});
                                    moveKwestiaToGlosowana(kwestia);
                                }
                            }
                        });
                    }
                }
            }
            //jezeli kwestia idzie do kosza,uwolinij hibernowane
            if(oldKwestia.czyAktywny==true && oldKwestia.status==KWESTIA_STATUS.REALIZOWANA && newKwestia.czyAktywny==false){
                unhibernateKwestieOpcje(newKwestia);
            }
        }
    });

    kwestiaAllowedToGlosowana=function(){
        var allKwestieGlosowane=Kwestia.find({status:KWESTIA_STATUS.GLOSOWANA,czyAktywny:true}).count();
        return allKwestieGlosowane < 3 ? true : false;
    };
    changeParametersSuccessObserver=function(kwestia){//głosowana->zrealizowana
        var globalPramsDraft=ParametrDraft.findOne({czyAktywny:true});
        var obj={
            nazwaOrganizacji:globalPramsDraft.nazwaOrganizacji,
            terytorium:globalPramsDraft.terytorium,
            terytAdres:globalPramsDraft.terytAdres,
            terytCODE:globalPramsDraft.terytCODE,
            terytCity:globalPramsDraft.terytCity,
            kontakty:globalPramsDraft.kontakty,
            regulamin: globalPramsDraft.regulamin,
            voteDuration: globalPramsDraft.voteDuration,
            voteQuantity:globalPramsDraft.voteQuantity,
            czasWyczekiwaniaKwestiiSpecjalnej:globalPramsDraft.czasWyczekiwaniaKwestiiSpecjalnej,
            addIssuePause:globalPramsDraft.addIssuePause,
            addCommentPause:globalPramsDraft.addCommentPause,
            addReferencePause:globalPramsDraft.addReferencePause,
            okresSkladaniaRR:globalPramsDraft.okresSkladaniaRR
        };
        var globalParam=Parametr.findOne();
        Meteor.call("updateParametr",globalParam._id,obj,function(error){
            if(!error)
                Meteor.call("setActivityParametrDraft",globalPramsDraft._id,false,function(error){
                    if(!error)
                        Meteor.call("updateStatusKwestii",kwestia._id,KWESTIA_STATUS.ZREALIZOWANA);
                });
        });
    };
    moveKwestiaToGlosowana=function(newKwestia,ZRDraft,ifUpdateZR){
        if(kwestiaAllowedToGlosowana()) {
            var czasGlosowania = Parametr.findOne({}).voteDuration;
            //console.log("ZMIANA_PARAMS");
            var final = moment(new Date()).add(czasGlosowania, "hours").format();
            var start = new Date();
            Meteor.call('updateStatusDataGlosowaniaKwestiiFinal', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, final,start,function(error){
                if(error)
                    console.log(error.reason);
            });
            addPowiadomienieKwestiaGlosowanaMethod(newKwestia._id);
            Meteor.call("sendEmailStartedVoting",newKwestia._id, getUserLanguage(), function(error){
                if(error){
                    var emailError = {
                        idIssue: newKwestia._id,
                        type: NOTIFICATION_TYPE.VOTE_BEGINNING
                    };
                    Meteor.call("addEmailError", emailError);
                }
            });
        }
    };
    setInQueueToVote=function(kwestie,numberKwestieAvailable){
        var tab=[];
        var tabKwestie = [];
        kwestie.forEach(function (item) {
            tabKwestie.push(item);
        });
        var arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[0].wartoscPriorytetu});
        if (arrayTheSameWartoscPrior.length >= 3) {
            var tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
            if(numberKwestieAvailable==3) {
                tab=setTabValues(3,tabKwestieSort,tab);
            }
            else if(numberKwestieAvailable==2){
                tab=setTabValues(2,tabKwestieSort,tab);
            }
            else
                tab.push(tabKwestieSort[0]._id);
        }
        else if (arrayTheSameWartoscPrior.length == 2) {
            var tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
            if(numberKwestieAvailable==3) {
                tab.push(tabKwestieSort[0]._id);
                tab.push(tabKwestieSort[1]._id);
                tabKwestie = _.reject(tabKwestie, function (el) {
                    return el.wartoscPriorytetu == tabKwestieSort[0].wartoscPriorytetu
                });
                tabKwestie = (_.sortBy(tabKwestie, "wartoscPriorytetu")).reverse();
                arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[0].wartoscPriorytetu});
                var tabKwestieSort2 = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
                tab.push(tabKwestieSort[0]._id);
            }
            else if(numberKwestieAvailable==2){
                tab.push(tabKwestieSort[0]._id);
                tab.push(tabKwestieSort[1]._id);
            }
            else{
                tab.push(tabKwestieSort[0]._id);
            }
        }
        else {
            if(numberKwestieAvailable==3) {
                arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[1].wartoscPriorytetu});
                if (arrayTheSameWartoscPrior.length >= 2) {
                    tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
                    tab = setTabValues(numberKwestieAvailable, [tabKwestie[0], tabKwestieSort[0], tabKwestieSort[1]], tab);
                }
                else {
                    tab = setTabValues(numberKwestieAvailable, [tabKwestie[0], tabKwestie[1], tabKwestie[2]], tab);
                }
            }
            else if(numberKwestieAvailable==2){
                arrayTheSameWartoscPrior = _.where(tabKwestie, {'wartoscPriorytetu': tabKwestie[1].wartoscPriorytetu});
                if (arrayTheSameWartoscPrior.length >= 2) {
                    tabKwestieSort = _.sortBy(arrayTheSameWartoscPrior, "dataWprowadzenia");
                    tab = setTabValues(numberKwestieAvailable, [tabKwestie[0], tabKwestieSort[0]], tab);
                }
                else{
                    tab = setTabValues(numberKwestieAvailable, [tabKwestie[0], tabKwestie[1]], tab);
                }
            }
            else{
                tab.push(tabKwestie[0]._id);
            }
        }
        return tab;
    };
    setTabValues=function(numberKwestieAvailable,tabKwestieSort,tab){
        for(var i=0;i<numberKwestieAvailable;i++){
            tab.push(tabKwestieSort[i]._id);
        }
        return tab;
    };
    rewriteZRMembersToList=function(zespolRealizacyjny,newKwestia){
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
    manageZR=function(newKwestia){
        var zespolRealizacyjny = ZespolRealizacyjny.findOne({_id: newKwestia.idZespolRealizacyjny});
        if (zespolRealizacyjny.kwestie.length > 0) {
            var kwestie = _.reject(zespolRealizacyjny.kwestie, function (kwestiaId) {
                return kwestiaId == newKwestia._id
            });
            if(kwestie.length==0 && zespolRealizacyjny._id!=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"})._id){
                Meteor.call("updateKwestieZRChangeActivity", zespolRealizacyjny._id, kwestie,false, function (error) {
                    if (error)
                        console.log(error.reason);
                    else
                        rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
                });
            }
            else {
                Meteor.call("updateKwestieZR", zespolRealizacyjny._id, kwestie, function (error) {
                    if (error)
                        console.log(error.reason);
                    else
                        rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
                });
            }
        }
        else {
            if(zespolRealizacyjny._id!=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"})._id){
                Meteor.call('removeZespolRealizacyjny', zespolRealizacyjny._id, function (error) {
                    if (error)
                        console.log(error.reason);
                    else
                        rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
                });
            }
            else
                rewriteZRMembersToList(zespolRealizacyjny, newKwestia);
        }
    };
    unhibernateKwestieOpcje=function(kwestia){
        var kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: kwestia.idParent, status: KWESTIA_STATUS.HIBERNOWANA});
        kwestieOpcje.forEach(function (kwestiaOpcja){
            if(kwestiaOpcja._id!=kwestia._id) {
                Meteor.call('updateStatusKwestii', kwestiaOpcja._id, KWESTIA_STATUS.DELIBEROWANA);
            }
        });
    }
});

addPowiadomienieAplikacjaObsRespondMethod=function(idKwestia,dataWprowadzenia,typ,idReceiver,idUserDraft){
    var newPowiadomienie ={
        idOdbiorca: idReceiver,
        idNadawca: null,
        dataWprowadzenia: dataWprowadzenia,
        tytul: "",
        powiadomienieTyp: typ,
        tresc: "",
        idKwestia:idKwestia,
        idUserDraft:idUserDraft,
        czyAktywny: true,
        czyOdczytany:false
    };
    Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
        if(error)
            console.log(error.reason);
    });
};

addPowiadomienieKwestiaGlosowanaMethod=function(idKwestia){
    var users=Users.find({'profile.userType':USERTYPE.CZLONEK});
    var kwestia=Kwestia.findOne({_id:idKwestia});
    users.forEach(function(user){
        var newPowiadomienie ={
            idOdbiorca: user._id,
            idNadawca: null,
            dataWprowadzenia: new Date(),
            tytul: "",
            powiadomienieTyp: NOTIFICATION_TYPE.VOTE_BEGINNING,
            tresc: "",
            idKwestia:idKwestia,
            kwestia:kwestia,
            czyAktywny: true,
            czyOdczytany:false
        };
        Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
            if(error)
                console.log(error.reason);
        });
    });
};
