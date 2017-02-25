/**
 * Created by Bartłomiej Szewczyk on 2015-08-31.

 Badanie zmian w postach w celu sprawdzenia czy kwestia powinna zmienić ccoś:
 jezeli w dodanym poscie "do archwium","do kosza","zrealizowana", spełni warunki:
 kworum>=l.uzytk && wartPrior>0, to
 obłsużone i sprawdzone:
 realizacja->kosz
 realizacja->zrealizowana
 */

Meteor.startup(function(){
    var kwestie = Kwestia.find({
        //czyAktywny: true,
        status: {
            $in: [
                KWESTIA_STATUS.DELIBEROWANA,
                KWESTIA_STATUS.GLOSOWANA,
                KWESTIA_STATUS.STATUSOWA,
                KWESTIA_STATUS.REALIZOWANA,
                KWESTIA_STATUS.ADMINISTROWANA,
                KWESTIA_STATUS.ZREALIZOWANA,
                KWESTIA_STATUS.OSOBOWA
            ]
        }
    });
    var postyPodKwestiami = Posts.find({czyAktywny: true});
    var zespoly = ZespolRealizacyjnyDraft.find({});

    postyPodKwestiami.observe({
        changedAt: function(newPost, oldPost, atIndex) {
            var kworum = liczenieKworumZwykle();
            var usersCount = newPost.glosujacy.length;
            if(newPost.wartoscPriorytetu > 0 && usersCount >= kworum) {
                switch(newPost.postType){

                    case POSTS_TYPES.DELIBERACJA:
                        Meteor.call('updateStatusDataGlosowaniaKwestii', newPost.idKwestia, KWESTIA_STATUS.DELIBEROWANA, null);
                        break;

                    case POSTS_TYPES.KOSZ:
                        var issue=Kwestia.findOne({_id:newPost.idKwestia});
                        if(issue.status!=KWESTIA_STATUS.ARCHIWALNA && issue.status!=KWESTIA_STATUS.HIBERNOWANA) {
                            console.log("kwestia realizowana->kosz(bo post)");
                            Meteor.call('removeKwestiaSetReason', newPost.idKwestia, KWESTIA_ACTION.SPECIAL_COMMENT_BIN, function (error) {
                                if (!error) {
                                    var kwestia = Kwestia.findOne({_id: newPost.idKwestia});

                                    if (kwestia.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {
                                        Meteor.call("setActivityParametrDraft", kwestia.idParametr, false);
                                        if (kwestia.status == KWESTIA_STATUS.ZREALIZOWANA) {//TODO

                                        }
                                    }
                                    if (kwestia.status == KWESTIA_STATUS.REALIZOWANA || kwestia.status == KWESTIA_STATUS.ZREALIZOWANA) {
                                        if (kwestia.idZespolRealizacyjny) {
                                            //if (kwestia.idZespolRealizacyjny != null)
                                            //manageZRPosts(kwestia);
                                        }
                                    }
                                    else if ((kwestia.status == KWESTIA_STATUS.DELIBEROWANA || kwestia.status == KWESTIA_STATUS.OSOBOWA) && kwestia.typ != KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {//osobowa,parametry,
                                        var zr = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
                                        if (zr) {
                                            rewriteZRMembersToList(zr, kwestia);
                                        }
                                    }
                                    if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],kwestia.typ)){
                                        var userDraft=UsersDraft.findOne({_id:kwestia.idUser});
                                        if(userDraft) {
                                            if(userDraft.profile.idUser!=null) {
                                                var user = Users.findOne({_id:userDraft.profile.idUser});
                                                addPowiadomienieAplikacjaRespondMethod(kwestia._id,new Date(),NOTIFICATION_TYPE.APPLICATION_REJECTED,user._id);
                                            }
                                            Meteor.call("sendApplicationRejected",userDraft,function(error,ret){
                                                if(!error)
                                                    Meteor.call("removeUserDraft",userDraft);
                                                else{
                                                    var emailError = {
                                                        idIssue: kwestia._id,
                                                        idUserDraft: userDraft._id,
                                                        type: NOTIFICATION_TYPE.APPLICATION_REJECTED
                                                    };
                                                    Meteor.call("addEmailError", emailError);
                                                }
                                            });
                                        }
                                        Meteor.call('removeUserDraftNotZrealizowany',userDraft._id);
                                    }
                                }
                            });
                        }
                        break;

                    case POSTS_TYPES.ARCHIWUM:

                        var kwestia=Kwestia.findOne({_id:newPost.idKwestia});
                        if(kwestia.status!=KWESTIA_STATUS.ARCHIWALNA && kwestia.status!=KWESTIA_STATUS.HIBERNOWANA) {
                            console.log("kwestia realizowana->Archiwum(bo post)");
                            Meteor.call('updateStatusKwestii', newPost.idKwestia, KWESTIA_STATUS.ARCHIWALNA, function (error) {
                                if (!error) {
                                    if (kwestia.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {//administrowana,glosowana
                                        Meteor.call("setActivityParametrDraft", kwestia.idParametr, false);
                                        if (kwestia.status == KWESTIA_STATUS.ZREALIZOWANA) {//TODO

                                        }
                                    }
                                    //TODO
                                    if ((kwestia.status == KWESTIA_STATUS.REALIZOWANA || kwestia.status == KWESTIA_STATUS.ZREALIZOWANA) && kwestia.typ != KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {
                                        if (kwestia.typ == KWESTIA_TYPE.BASIC) {
                                            if (kwestia.idZespolRealizacyjny) {
                                                //f (kwestia.idZespolRealizacyjny != null)
                                                //manageZRPosts(kwestia);
                                            }
                                        }
                                    }
                                    else if ((kwestia.status == KWESTIA_STATUS.DELIBEROWANA || kwestia.status == KWESTIA_STATUS.OSOBOWA) && kwestia.typ != KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE) {
                                        var zr = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
                                        if (zr) {
                                            rewriteZRMembersToList(zr, kwestia);
                                        }
                                    }
                                    if(_.contains([KWESTIA_TYPE.ACCESS_DORADCA,KWESTIA_TYPE.ACCESS_ZWYCZAJNY],kwestia.typ)){
                                        var userDraft=UsersDraft.findOne({_id:kwestia.idUser});
                                        if(userDraft) {
                                            if(userDraft.profile.idUser!=null) {
                                                var user = Users.findOne({_id:userDraft.profile.idUser});
                                                addPowiadomienieAplikacjaRespondMethod(kwestia._id,new Date(),NOTIFICATION_TYPE.APPLICATION_REJECTED,user._id);
                                            }
                                            Meteor.call("sendApplicationRejected",userDraft,function(error,ret){
                                                if(!error)
                                                    Meteor.call("removeUserDraft",userDraft);
                                                else{
                                                    var emailError = {
                                                        idIssue: kwestia._id,
                                                        idUserDraft: userDraft._id,
                                                        type: NOTIFICATION_TYPE.APPLICATION_REJECTED
                                                    };
                                                    Meteor.call("addEmailError", emailError);
                                                }
                                            });
                                        }
                                        Meteor.call('removeUserDraftNotZrealizowany',userDraft._id);
                                    }

                                }
                                else throwError(error.reason);

                            });
                        }
                        break;
                }
            }
        }
    });



    addPowiadomienieAplikacjaRespondMethodPosts=function(idKwestia,dataWprowadzenia,typ,idReceiver,zespol){
        var newPowiadomienie ={
            idOdbiorca: idReceiver,
            idNadawca: null,
            dataWprowadzenia: dataWprowadzenia,
            tytul: "",
            powiadomienieTyp: typ,
            tresc: "",
            idKwestia:idKwestia,
            czyAktywny: true,
            czyOdczytany:false,
            zespol:zespol
        };
        Meteor.call("addPowiadomienie",newPowiadomienie,function(error){
            if(error)
                console.log(error.reason);
        });
    };
});
