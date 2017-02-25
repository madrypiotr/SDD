/**
 * je�eli w kwestii zostanie skompelotwany 3ci cz�onek-
 * kwestia idzie do g�osowania
 * dotyczy to kwestii:
 * -deliberowanej(basic)
 * -osobowej nie,bo zr przypsujemy automatycznie
 *
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
    var zespoly = ZespolRealizacyjnyDraft.find({});

    zespoly.observe({
        changedAt: function(newZespol, oldZespol, atIndex) {
            var kworum = liczenieKworumZwykle();
            var kwestia = Kwestia.findOne({czyAktywny: true, idZespolRealizacyjny: newZespol._id});
            if (kwestia != null) {
                if(kwestia.wartoscPriorytetu > 0 && kwestia.glosujacy.length >= kworum && newZespol.zespol.length >= 3 && kwestia.status != KWESTIA_STATUS.REALIZOWANA){
                    if(kwestia.status == KWESTIA_STATUS.DELIBEROWANA){
                        moveKwestiaToGlosowana(kwestia);
                    }
                    else if (kwestia.status == KWESTIA_STATUS.STATUSOWA){

                        Meteor.call('updateStatusDataOczekwianiaKwestii', kwestia._id, KWESTIA_STATUS.OCZEKUJACA,new Date());

                        Meteor.call("sendEmailHonorowyInvitation", kwestia.idUser,function(error,ret){
                            if(error){
                                Meteor.call("setIssueProblemSendingEmail",kwestia._id,
                                    SENDING_EMAIL_PROBLEMS.NO_INVITATION_HONOROWY);
                                var emailError = {
                                    idIssue: kwestia._id,
                                    idUserDraft: kwestia.idUser,
                                    type: NOTIFICATION_TYPE.HONOROWY_INVITATION
                                };
                                Meteor.call("addEmailError", emailError);
                            }
                        });
                    }
                }
            }
        }
    });
    moveKwestiaToGlosowana=function(newKwestia,ZRDraft,ifUpdateZR){
        if(kwestiaAllowedToGlosowana()){
            var czasGlosowania = Parametr.findOne({}).voteDuration;
            //console.log("ZMIANA_PARAMS");
            var final = moment(new Date()).add(czasGlosowania, "hours").format();
            var start = new Date();
            Meteor.call('updateStatusDataGlosowaniaKwestiiFinal', newKwestia._id, KWESTIA_STATUS.GLOSOWANA, final,start,function(error){
                if(error)
                    console.log(error.reason);
            });
            Meteor.call("sendEmailStartedVoting",newKwestia._id, function(error){
                if(error){
                    var emailError = {
                        idIssue: newKwestia._id,
                        type: NOTIFICATION_TYPE.VOTE_BEGINNING
                    };
                    Meteor.call("addEmailError", emailError);
                }
            });
            addPowiadomienieKwestiaGlosowanaMethod(newKwestia._id);
        }
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
});


