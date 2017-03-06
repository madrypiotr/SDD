Template.addHonorowy.rendered=function(){
    document.getElementById("submitHonorowy").disabled = false;
    $("#honorowyForm").validate({
        rules: {
            email: {
                email: true
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email: validEmailMessage()
            },
            uzasadnienie: {
                required: fieldEmptyMessage()
            }
        },
        highlight: function (element) {
            highlightFunction(element);
        },
        unhighlight: function (element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            validationPlacementError(error, element);
        }
    });
};
Template.addHonorowy.events({
    'submit form':function(e){
        e.preventDefault();
        if ($('#honorowyForm').valid()) {
            var zr=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"});
            if(zr.zespol.length >=3) {
                document.getElementById("submitHonorowy").disabled = true;
                var email = $(e.target).find('[name=email]').val();
                Meteor.call("serverCheckExistsUserDraft", email, function (error, ret) {
                    if (error) {
                        throwError(error.reason);
                    }
                    else {
                        if (ret == false) {
                            Meteor.call("serverCheckExistsUser", email, null, null, function (error, ret) {
                                if (error) {
                                    throwError(error.reason);
                                }
                                else {
                                    if (ret == false) {
                                        var idUser = null;
                                        var firstName = "";
                                        var lastName = "";

                                        var newUserDraft = [
                                            {
                                                email: email,
                                                login: "",
                                                firstName: firstName,
                                                lastName: lastName,
                                                role: 'user',
                                                uwagi: $(e.target).find('[name=uzasadnienie]').val(),
                                                userType: USERTYPE.HONOROWY,
                                                pesel: "",
                                                idUser: idUser,
                                                licznikKlikniec: 0
                                            }];
                                        addUserDraftHonorowy(newUserDraft);
                                    }
                                    else {
                                        Meteor.call("serverCheckExistsUser", $(e.target).find('[name=email]').val(), USERTYPE.CZLONEK, USERTYPE.HONOROWY, function (error, ret) {
                                            if (error) {
                                                throwError(error.reason);
                                            }
                                            else {
                                                if (ret == false) {
                                                    var idUser = null;
                                                    var email = $(e.target).find('[name=email]').val();
                                                    Meteor.call("getUserData", USERTYPE.DORADCA, email, function (error, ret) {
                                                        if (error) {
                                                            throwError(error.reason);
                                                        }
                                                        else {
                                                            idUser = ret._id;
                                                            var firstName = "";
                                                            var lastName = "";
                                                            if (idUser != null) {
                                                                firstName = ret.profile.firstName;
                                                                lastName = ret.profile.lastName;
                                                            }
                                                            var newUserDraft = [
                                                                {
                                                                    email: email,
                                                                    login: "",
                                                                    firstName: firstName,
                                                                    lastName: lastName,
                                                                    role: 'user',
                                                                    uwagi: $(e.target).find('[name=uzasadnienie]').val(),
                                                                    userType: USERTYPE.HONOROWY,
                                                                    pesel: "",
                                                                    idUser: idUser,
                                                                    licznikKlikniec: 0
                                                                }];
                                                            addUserDraftHonorowy(newUserDraft);
                                                        }
                                                    });

                                                }
                                                else {
                                                    throwError(TXV.USER_EXIST);
                                                    document.getElementById("submitHonorowy").disabled = false;
                                                    return false;
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else {
                            throwError(TXV.ACCESS_EXIST);
                            document.getElementById("submitHonorowy").disabled = false;
                            return false;
                        }
                    }
                });
            }
            else{
                bootbox.alert(TXV.IMPL_TEAM_NOT_COMPLETE);
            }
        }
    },
    'reset form':function(e){
        Router.go('listKwestia');
    }
});
addUserDraftHonorowy=function(newUser){
    Meteor.call('addUserDraft', newUser, function (error, ret) {
        if (error) {
            throwError(error.reason);
        }
        else {
            addKwestiaOsobowaHonorowy(ret, newUser);
        }
    });
};
addKwestiaOsobowaHonorowy=function(idUserDraft,newUser){
    var ZR=ZespolRealizacyjny.findOne({_id:"jjXKur4qC5ZGPQkgN"});
    var newZR=[{
        nazwa:ZR.nazwa,
        idZR:ZR._id,
        zespol:ZR.zespol
    }];
    Meteor.call('addZespolRealizacyjnyDraft', newZR, function (error,ret) {
        if (error) {
            throwError(error.reason);
        }
        else {
            var fullName=null;
            if(newUser[0].idUser!=null){
                var user=Users.findOne({_id:newUser[0].idUser});
                fullName=user.profile.fullName;
            }
            var daneAplikanta = {
                fullName: fullName,
                email: newUser[0].email,
                uwagi: newUser[0].uwagi
            };
            var newKwestia = [
                {
                    idUser: idUserDraft,
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: TXV.APPL_HONOR_MEMBER,
                    wartoscPriorytetu: 0,
                    wartoscPriorytetuWRealizacji: 0,
                    idTemat: Temat.findOne({})._id,
                    idRodzaj: Rodzaj.findOne({})._id,
                    idZespolRealizacyjny: ret,
                    dataGlosowania: null,
                    krotkaTresc: TXV.APPL_HONOR_MEMBER+ newUser[0].email,
                    szczegolowaTresc: daneAplikanta,
                    isOption: false,
                    status: KWESTIA_STATUS.STATUSOWA,
                    typ: KWESTIA_TYPE.ACCESS_HONOROWY,
                    idZglaszajacego:Meteor.userId()
                }];
            Meteor.call('addKwestiaStatusowa', newKwestia, function (error, ret) {
                if (error) {
                    // optionally use a meteor errors package
                    if (typeof Errors === "undefined")
                        Log.error('Error: ' + error.reason);
                    else {
                        throwError(error.reason);
                    }
                }
                else {
                    Router.go("home");
                    addPowiadomienieAplikacjaIssueFunction(ret,newKwestia[0].dataWprowadzenia);
                    przyjecieWnioskuHonorowyConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej, daneAplikanta.email, "członek honorowy");
                    var user = UsersDraft.findOne({_id: idUserDraft});
                    Meteor.call("sendEmailAddedIssue", ret, function(error) {
                        if(error){
                            var emailError = {
                                idIssue: ret,
                                type: NOTIFICATION_TYPE.NEW_ISSUE
                            };
                            Meteor.call("addEmailError", emailError);
                        }
                    } );
                }
            });
        }
    });
};

