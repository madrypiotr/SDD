Template.answerInvitation.rendered=function(){
    var userDraft=getUserDraftMethod(Router.current().params);
    var kwestia=getKwestia(Router.current().params);
    var licznik=userDraft.licznikKlikniec+1;
    if(kwestia.isAnswerPositive!=null) {
        Meteor.call("updateLicznikKlikniec", userDraft._id, licznik, function (error) {
            if (error)
                throwError(error.reason);
        });
    }
},
Template.answerInvitation.helpers({
    userNotAnswered:function(){
        var currentRoute=Router.current().params;
        var kwestia=getKwestia(currentRoute);
        if(kwestia) {
            return kwestia.isAnswerPositive==null ? true: false;
        }
    },
    timeExpired:function(){
        var kwestia=getKwestia(Router.current().params);
        var param=Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej;
        //console.log("ZMIANA_PARAMS");
        return (moment(kwestia.dataRozpoczeciaOczekiwania).add("days",param).format() < moment(new Date()).format()) ? true : false;

    },
    fullName:function(){
        var userDraft=getUserDraftMethod(Router.current().params);
        return userDraft.profile.firstName+" "+userDraft.profile.lastName;
    },
    position:function(){
        var userDraft=getUserDraftMethod(Router.current().params);
        if(userDraft.profile.userType==USERTYPE.HONOROWY)
        return TXV.HONORARY_MEMBER;
    },
    organizationName:function(){
        return Parametr.findOne().nazwaOrganizacji ? Parametr.findOne().nazwaOrganizacji : null;
    },
    answeredNow:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraftMethod(Router.current().params);
        return (kwestia.isAnswerPositive==true || kwestia.isAnswerPositive==false) && userDraft.licznikKlikniec<=1 ? true : false;
    },
    ansPos:function(){
        var kwestia=getKwestia(Router.current().params);
        return kwestia.isAnswerPositive==true? true:false;
    },
    answerPositive:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraftMethod(Router.current().params);
        return kwestia.isAnswerPositive==true &&  userDraft.licznikKlikniec>1  ? true : false;
    },
    answerNegative:function(){
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraftMethod(Router.current().params);
        return kwestia.isAnswerPositive==false &&  userDraft.licznikKlikniec>1  ? true : false;
    },
    url:function(){
        var userDraft=getUserDraftMethod(Router.current().params);
        return("/issueInfo/")
    },
    actualKwestia:function(){
        return getKwestia(Router.current().params);
    },
    isGuest:function(){
        var userDraft=getUserDraftMethod(Router.current().params);
        return userDraft.profile.idUser==null ? true : false;
    }
});
Template.answerInvitation.events({
   'click #apply':function(e){
       e.preventDefault();//kwestia idzie do realizacji
       var kwestia=getKwestia(Router.current().params);

       if(kwestia.typ=KWESTIA_TYPE.ACCESS_HONOROWY){

           var userDraft=getUserDraftMethod(Router.current().params);
           //jezeli to jest istniejący doradca- email o wynku i update jego statusu
           if(userDraft.profile.idUser!=null){
               applyPositiveMethod(kwestia);
               Meteor.call("updateUserType",userDraft.profile.idUser,userDraft.profile.userType,function(error){
                   Meteor.call("sendApplicationAccepted", userDraft._id, "acceptExisting", function (error) {
                       if(!error)
                           Meteor.call("removeUserDraft", userDraft._id);
                       else{
                           var emailError = {
                               idIssue: kwestia._id,
                               idUserDraft: userDraft._id,
                               type: NOTIFICATION_TYPE.APPLICATION_ACCEPTED
                           };
                           Meteor.call("addEmailError", emailError);
                       }
                   });
               });
           }
           else{
                fillDataNewHonorowyBootbox(kwestia,userDraft.email);
           }
       }

   },
    'click #refuse':function(e){
        e.preventDefault();
        var kwestia=getKwestia(Router.current().params);
        var userDraft=getUserDraftMethod(Router.current().params);

        Meteor.call('removeKwestiaSetReasonAnswer', kwestia._id,KWESTIA_ACTION.INVITATION_HONOROWY_REJECTED,false,function(error) {
            if(!error) {
                if (kwestia.idZespolRealizacyjny) {
                    var zrDraft=ZespolRealizacyjnyDraft.findOne({_id:kwestia.idZespolRealizacyjny});
                    Meteor.call("removeZespolRealizacyjnyDraft",kwestia.idZespolRealizacyjny,function(error){
                       if(!error) {
                           rewriteZRMembersToListMethod(zrDraft, kwestia);
                           var licznik=userDraft.licznikKlikniec+1;

                           Meteor.call("removeUserDraftNotZrealizowanyLicznik", userDraft._id,licznik,function(error){
                               if(error)
                                   throwError(error.reason);
                           });
                       }
                    });
                }
            }
            else
                throwError(error.reason);
        });
    }
});
getKwestia=function(currentRoute){
    var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
    var kwestia=Kwestia.findOne({idUser:userDraft._id});
    return kwestia? kwestia: null;
};
getUserDraftMethod=function(currentRoute){
    var userDraft=UsersDraft.findOne({linkAktywacyjny:currentRoute.linkAktywacyjny});
    return userDraft ? userDraft : null;
};

applyPositiveMethod=function(kwestia){
    var nrUchw=kwestia.issueNumber;
    kwestia.dataRealizacji = new Date();
    kwestia.numerUchwaly = kwestia.issueNumber; //nadawanieNumeruUchwalyMethod(kwestia.dataRealizacji);
    var idZr=kwestia.idZespolRealizacyjny;
    var zrDraft = ZespolRealizacyjnyDraft.findOne({_id: kwestia.idZespolRealizacyjny});
    if (zrDraft.idZR != null) {//jezeli draft ma id ZR( kopiuje od istniejącego ZR), to dopisz do listy ZR tego drafta
        var ZR = ZespolRealizacyjny.findOne({_id: zrDraft.idZR});
        if(ZR) {
            updateListKwestieMethod(ZR, kwestia._id);
        }
        else {
            createNewZRMethod(zrDraft, kwestia);
        }
    }
    else {
        createNewZRMethod(zrDraft, kwestia);
    }

    Meteor.call('removeZespolRealizacyjnyDraft',kwestia.idZespolRealizacyjny,function(error){
        if(!error){
            var userDraft=getUserDraftMethod(Router.current().params);
            var counter=userDraft.licznikKlikniec+1;
            Meteor.call("updateLicznikKlikniec",userDraft._id,counter,function(error){
                if(!error)
                    Meteor.call("setAnswerKwestiaOczekujacaNrUchwDataRealizacji",kwestia._id,true,nrUchw,new Date(),function(error){
                        if(error)
                            throwError(error.reason);
                    });
            });
        }
    });
};

fillDataNewHonorowyBootbox=function(kwestia,email){
    bootbox.dialog({
            title: TXV.TO_ACCESS_COMPLETE_THE_FIELDS,
            closeButton:false,
            message:
            '<div class="row">  ' +
            '<div class="col-md-12"> ' +
            '<form class="form-horizontal"> ' +
            '<div class="form-group"> ' +
                '<label class="col-md-4 control-label" for="name">TXV.F_NAME</label> ' +
                '<div class="col-md-4"> ' +
                    '<input id="firstName" name="firstName" type="text"  class="form-control input-md"> ' +
                '</div> ' +
            '</div>'+
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">TXV.L_NAME</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="lastName" name="lastName" type="text"  class="form-control input-md"> ' +
            '</div> ' +'</div>'+
            '<div class="form-group"> ' +
            '<label class="col-md-4 control-label" for="name">TXV.CITY</label> ' +
            '<div class="col-md-4"> ' +
            '<input id="city" name="city" type="text"  class="form-control input-md"> ' +
            '</div> ' +'</div>'+
            '</form> ' +
            '</div>  ' +
            '</div>',
            buttons: {
                success: {
                    label: TXV.DO_STORE,
                    className: "btn-success successSave",
                    callback: function () {
                        var firstName = $('#firstName').val();
                        var lastName=$('#lastName').val();
                        var city=$('#city').val();
                        if(firstName.trim()!='' && lastName.trim()!='' && city.trim()!=''){
                            $('.successSave').css("visibility", "hidden");
                            addNewUser(firstName,lastName,city,email,kwestia);
                        }
                        else{
                            fillDataNewHonorowyBootbox(kwestia,email);
                            $('.successSave').css("visibility", "visible");
                            GlobalNotification.error({
                                title: TXV.WARNING,
                                content: TXV.DO_NOT_EMPTY,
                                duration: 4 // duration the notification should stay in seconds
                            });
                        }
                    }
                },
                main: {
                    label: TXV.GO_BACK,
                    className: "btn-primary"
                }
            }
        }
    );
};
addNewUser=function(firstName,lastName,city,email,kwestia){
    applyPositiveMethod(kwestia);

    Meteor.call("serverGenerateLogin", firstName, lastName, function(err, ret) {
        if (!err) {
            var newUser = [
                {
                    email: email,
                    login: "",
                    firstName: firstName,
                    lastName: lastName,
                    city:city,
                    userType:USERTYPE.HONOROWY

                }];
            newUser[0].login = ret;//generateLogin(firstName,lastName);
            newUser[0].fullName=firstName+" "+lastName;
            newUser[0].password=CryptoJS.MD5(newUser[0].login).toString();
            newUser[0].confirm_password=newUser[0].password;

            Meteor.call('addUser', newUser, function (error,ret) {
                if (error) {
                    throwError(error.reason);
                }
                else {
                    var idUser=ret;
                    Meteor.call("removeUserDraftAddNewIdUser", getUserDraftMethod(Router.current().params)._id,idUser, function (error) {
                        if (error)
                            throwError(error.reason);
                        else{
                            Meteor.call("sendFirstLoginData",idUser,newUser[0].password,function(error){
                                if(error){
                                    bootbox.alert(TXV.ALERT_LOG1 + TXV.ALERT_LOG2 + TXV.ALERT_LOG3);

                                    var emailError = {
                                        idUserDraft: userDraft._id,
                                        type: NOTIFICATION_TYPE.FIRST_LOGIN_DATA
                                    };
                                    Meteor.call("addEmailError", emailError);
                                }
                            })
                        }
                    });
                }
            });
        } else {
            throwError(err.reason)
        }
    });
};