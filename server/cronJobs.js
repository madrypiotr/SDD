/**
 * Created by Bartłomiej Szewczyk on 2015-09-10.
 */

//START CRONA
SyncedCron.start();

//USTAWIENIA CRONA do sprawdzania głosowanych kwestii - co minute
SyncedCron.add({
    name: 'checking dates crone',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 30 seconds');
    },
    job: function() {
        return checkingEndOfVote();
    }
});

SyncedCron.add({
    name: 'checking RR',
    schedule: function(parser) {
        return parser.text('every 1 day');
    },
    job: function() {
        return checkingRRExist();
    }
});

SyncedCron.add({
    name: 'checking if deliberation expired',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 day');
    },
    job: function() {
        return checkingDeliberationExpiration();
    }
});


//==================================== wywoływane metody ======================================================//

checkingRRExist=function(){
    var kwestie=Kwestia.find({
        czyAktywny:true,
        status:{$in:[KWESTIA_STATUS.ZREALIZOWANA,KWESTIA_STATUS.REALIZOWANA]},
        typ:{$nin:[KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE]}});
    kwestie.forEach(function(kwestia){
        var initial=_.last(kwestia.listaDatRR);
        //console.log("ZMIANA_PARAMS");
        var nextCheck= moment(initial).add(Parametr.findOne().okresSkladaniaRR,"days").format();
        var currentTime=moment(new Date()).format();
        //console.log("Daty miedzy którymi musi pojawić się raport");
        //console.log(initial);
        //console.log(nextCheck);
        //console.log("Obecna godzina");
        //console.log(currentTime);
       if(nextCheck<=currentTime){
           var raporty=Raport.find({idKwestia:kwestia._id,
               dataUtworzenia: {
                   $gte: initial,
               }},{sort:{dataWprowadzenia:-1}});

           if(raporty.count()==0) {
               Meteor.call("sendEmailNoRealizationReport", kwestia._id, function (error) {
                   if (error) {
                       console.log(error.reason);
                       var emailError = {
                           idIssue: kwestia._id,
                           type: NOTIFICATION_TYPE.LACK_OF_REALIZATION_REPORT
                       };
                       Meteor.call("addEmailError", emailError);
                   }
               });
               var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
               users.forEach(function (user) {
                   var zr = ZespolRealizacyjny.findOne({_id: kwestia.idZespolRealizacyjny});
                   addPowiadomienieAplikacjaRespondMethodPosts(kwestia._id, new Date(), NOTIFICATION_TYPE.LACK_OF_REALIZATION_REPORT, user._id, zr.zespol);
               });
           }
           var array=kwestia.listaDatRR;
           array.push(currentTime);
           Meteor.call("updateDeadlineNextRR",kwestia._id,array,function(error){
              if(!error){
              }
           });
       }
    });
};
checkingEndOfVote = function() {
    var actualDate = moment(new Date()).format();
    var kwestie = Kwestia.find(
        {
            czyAktywny: true,
            status: {$in: [KWESTIA_STATUS.GLOSOWANA]}//KWESTIA_STATUS.OCZEKUJACA
        },
        {
            sort: {wartoscPriorytetu: -1, dataWprowadzenia: 1}
        }
    );

    kwestie.forEach(function (kwestia) {
        var issueUpdated = Kwestia.findOne({_id: kwestia._id});
        if(issueUpdated.status == KWESTIA_STATUS.GLOSOWANA) {
            if(actualDate >= issueUpdated.dataGlosowania) {
                if (issueUpdated.wartoscPriorytetu > 0) {
                    if (issueUpdated.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
                        changeParametersSuccess(issueUpdated);

                    else {
                        issueUpdated.dataRealizacji = new Date();
                        issueUpdated.numerUchwaly = issueUpdated.issueNumber;//nadawanieNumeruUchwaly(kwestia.dataRealizacji);

                        if(issueUpdated.idParent!=null) {
                            hibernateKwestieOpcje(issueUpdated);
                        }

                        var zrDraft = ZespolRealizacyjnyDraft.findOne({_id: issueUpdated.idZespolRealizacyjny});
                        if (zrDraft.idZR != null) {
                            var ZR = ZespolRealizacyjny.findOne({_id: zrDraft.idZR});
                            if(ZR) {
                                updateListKwestie(ZR, issueUpdated);
                                Meteor.call('removeZespolRealizacyjnyDraft',issueUpdated.idZespolRealizacyjny);
                            }
                            else {
                                createNewZR(zrDraft, issueUpdated);
                                Meteor.call('removeZespolRealizacyjnyDraft',issueUpdated.idZespolRealizacyjny);
                            }
                        }
                        else {
                            createNewZR(zrDraft, issueUpdated);
                            Meteor.call('removeZespolRealizacyjnyDraft',issueUpdated.idZespolRealizacyjny);
                        }


                        if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY,KWESTIA_TYPE.ACCESS_HONOROWY],issueUpdated.typ)) {
                            var userDraft = UsersDraft.findOne({_id: issueUpdated.idUser});

                            if(userDraft.profile.idUser!=null){
                                var user=Users.findOne({_id:userDraft.profile.idUser});
                                if(user){
                                    var newUserFields=null;
                                    var text=null;
                                    if(issueUpdated.typ==KWESTIA_TYPE.ACCESS_ZWYCZAJNY) {
                                        newUserFields = {
                                            address: userDraft.profile.address,
                                            zip: userDraft.profile.zip,
                                            language: userDraft.profile.language,
                                            userType: userDraft.profile.userType,
                                            rADking: 0,
                                            pesel: userDraft.profile.pesel
                                        };
                                        text="rewriteFromDraftToUser";
                                    }
                                    else if(issueUpdated.typ==KWESTIA_TYPE.ACCESS_HONOROWY){
                                        newUserFields=userDraft.profile.userType;
                                        text="updateUserType";
                                    }
                                    Meteor.call(text,user._id,newUserFields,function(error){
                                        if(!error){
                                            Meteor.call("removeUserDraft",userDraft._id,function(error){
                                                if(!error){
                                                    addPowiadomienieAplikacjaRespondMethodPosts(issueUpdated._id,new Date(),NOTIFICATION_TYPE.APPLICATION_ACCEPTED,user._id,null);
                                                    Meteor.call("sendApplicationAccepted",userDraft,"acceptExisting",function(error){
                                                        if(error){
                                                            var emailError = {
                                                                idIssue: issueUpdated._id,
                                                                idUserDraft: userDraft._id,
                                                                type: NOTIFICATION_TYPE.APPLICATION_ACCEPTED
                                                            };
                                                            Meteor.call("addEmailError", emailError);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            else {
                                var activationLink = CryptoJS.MD5(userDraft._id).toString();
                                if (userDraft) {
                                    Meteor.call("setZrealizowanyActivationHashUserDraft", userDraft._id, activationLink, true, function (error, ret) {
                                        (!error)
                                        {
                                            Meteor.call("sendApplicationAccepted", UsersDraft.findOne({_id: userDraft._id}), "acceptNew", function (error) {
                                                if(error){
                                                    Meteor.call("setIssueProblemSendingEmail",issueUpdated._id,
                                                        SENDING_EMAIL_PROBLEMS.NO_ACTVATION_LINK);

                                                    var emailError = {
                                                        idIssue: issueUpdated._id,
                                                        idUserDraft: userDraft._id,
                                                        type: NOTIFICATION_TYPE.APPLICATION_ACCEPTED
                                                    };
                                                    Meteor.call("addEmailError", emailError);
                                                }
                                                else{
                                                    Meteor.call("updateLicznikKlikniec", userDraft._id, 0);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
                else {
                    if(issueUpdated.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE){
                        Meteor.call("setActivityParametrDraft", issueUpdated.idParametr, false);
                    }
                    var ZRDraft=ZespolRealizacyjnyDraft.findOne({_id:issueUpdated.idZespolRealizacyjny});
                    if(ZRDraft){
                        var zr=null;
                        if(ZRDraft.idZR!=null)
                            zr=ZespolRealizacyjny.findOne({_id:ZRDraft.idZR});
                        else zr=ZRDraft;
                        if(zr)
                            rewriteZRMembersToList(zr, issueUpdated);
                        else
                            rewriteZRMembersToList(ZRDraft, issueUpdated);
                        Meteor.call('removeZespolRealizacyjnyDraft', ZRDraft._id, function (error) {
                            if (error)
                                console.log(error.reason);
                        });
                    }
                    if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],issueUpdated.typ)){
                        var userDraft=UsersDraft.findOne({_id:issueUpdated.idUser});
                        if(userDraft) {
                            if(userDraft.profile.idUser!=null) {
                                var user = Users.findOne({_id:userDraft.profile.idUser});
                                addPowiadomienieAplikacjaRespondMethod(issueUpdated._id,new Date(),NOTIFICATION_TYPE.APPLICATION_REJECTED,user._id);
                            }
                            Meteor.call("sendApplicationRejected",userDraft,function(error,ret){
                                if(!error)
                                    Meteor.call("removeUserDraft",userDraft);
                                else{
                                    var emailError = {
                                        idIssue: issueUpdated._id,
                                        idUserDraft: userDraft._id,
                                        type: NOTIFICATION_TYPE.APPLICATION_REJECTED
                                    };
                                    Meteor.call("addEmailError", emailError);
                                }
                            });
                        }
                        Meteor.call('removeUserDraftNotZrealizowany',userDraft._id);
                    }
                    Meteor.call('removeKwestiaSetReason', issueUpdated._id,KWESTIA_ACTION.NEGATIVE_PRIORITY_VOTE);


                }
            }
        }
    });
};

checkingDeliberationExpiration=function(){
    var kwestie = Kwestia.find({czyAktywny: true, status:
    {$in: [
        KWESTIA_STATUS.DELIBEROWANA,
        KWESTIA_STATUS.ADMINISTROWANA,
        KWESTIA_STATUS.STATUSOWA,
        KWESTIA_STATUS.OSOBOWA
    ]}});
    kwestie.forEach(function(kwestia){
        var date=moment(kwestia.dataWprowadzenia).add(1,"month").format();
        if(date<=moment(new Date().format()))
           Meteor.call("removeKwestiaSetReason",kwestia._id,KWESTIA_ACTION.DELIBERATION_EXPIRED);
    });
};
//=========================================== metody pomocnicze ===============================================//

awansUzytkownika = function(idZespoluRealiz, pktZaUdzialWZesp) {
    var zespol = ZespolRealizacyjnyDraft.findOne({_id: idZespoluRealiz}).zespol;

    zespol.forEach(function (idUzytkownikaZespolu){
        var uzytkownikAwansujacy = Users.findOne({_id: idUzytkownikaZespolu});
        if(uzytkownikAwansujacy) {
            uzytkownikAwansujacy.profile.rADking += pktZaUdzialWZesp;
            Meteor.call('updateUserRanking', idUzytkownikaZespolu, uzytkownikAwansujacy.profile.rADking);
        }
    });
};

//Nadawanie numeru uchwały - dla kwesti które przechodzą do realizacji, każdego dnia numery idą od 1
nadawanieNumeruUchwaly = function(dataRealizacji) {

    var numerUchw = 1;
    var kwestieRealizowane = Kwestia.find({czyAktywny: true, numerUchwaly: !null});

    kwestieRealizowane.forEach(function (kwestiaRealizowana) {

        if(kwestiaRealizowana.dataRealizacji.toDateString() == dataRealizacji.toDateString())
            numerUchw++
    });

    return numerUchw;
};
//...................................................................................
changeParametersSuccess=function(kwestia){
    console.log(kwestia);
    var globalPramsDraft=ParametrDraft.findOne({_id:kwestia.idParametr,czyAktywny:true});
    console.log("change param");
    console.log(globalPramsDraft);
    var obj={
        nazwaOrganizacji:globalPramsDraft.nazwaOrganizacji,
        terytorium:globalPramsDraft.terytorium,
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
        if(!error) {
            Meteor.call("setActivityParametrDraft", globalPramsDraft._id, false, function (error) {
                if (!error)
                    Meteor.call("updateStatusNrUchwalyDataRealizacjiiKwestii", kwestia._id, KWESTIA_STATUS.ZREALIZOWANA, kwestia.issueNumber, new Date());
            });
        }
    });
};

updateListKwestie=function(ZR,kwestia){
    if(kwestia) {
        var listKwestii = ZR.kwestie.slice();
        listKwestii.push(kwestia._id);
        Meteor.call('updateListKwesti', ZR._id, listKwestii, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);

            }
            else {
                Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, ZR._id);
            }
        });
    }
};

createNewZR=function(zrDraft,kwestia){
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
                Log.error('Error: ' + error.reason);
            else
                throwError(error.reason);

        }
        else {
            var idZR = ret;
            Meteor.call('updateStatNrUchwDtRealIdZespolKwestii', kwestia._id, KWESTIA_STATUS.REALIZOWANA, kwestia.numerUchwaly, kwestia.dataRealizacji, idZR);
        }
    });
};
hibernateKwestieOpcje=function(kwestia){
    kwestieOpcje = Kwestia.find({czyAktywny: true, idParent: kwestia.idParent,
        status:{$in:[KWESTIA_STATUS.GLOSOWANA,KWESTIA_STATUS.DELIBEROWANA]}});
    if(kwestieOpcje.count()>1){
        kwestieOpcje.forEach(function (kwestiaOpcja) {
            if(kwestiaOpcja._id!=kwestia._id) {
                Meteor.call('updateStatusKwestii', kwestiaOpcja._id, KWESTIA_STATUS.HIBERNOWANA);
            }
        });
    }
};

addPowiadomienieAplikacjaRespondMethod=function(idKwestia,dataWprowadzenia,typ,idReceiver){
    var newPowiadomienie ={
        idOdbiorca: idReceiver,
        idNadawca: null,
        dataWprowadzenia: dataWprowadzenia,
        tytul: "",
        powiadomienieTyp: typ,
        tresc: "",
        idKwestia:idKwestia,
        czyAktywny: true,
        czyOdczytany:false
    };
    Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
        if(error)
            console.log(error.reason);
    });
};