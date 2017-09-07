//## Support for a Member who has the status of Advisor

Template.advisorForm.rendered = function () {
    document.getElementById('submitButton').disabled = false;
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });
    $('#advisorFormApp').validate({
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
            firstName: {
                required: fieldEmptyMessage()
            },
            lastName: {
                required: fieldEmptyMessage()
            },
            phone:{
                required:fieldEmptyMessage()
            },
            city:{
                required:fieldEmptyMessage()
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

Template.advisorForm.events({
    'submit form': function (e) {
        e.preventDefault();
        if ($('#advisorFormApp').valid()) {
            document.getElementById('submitButton').disabled = true;
            var email = $(e.target).find('[name=email]').val();
            Meteor.call('serverCheckExistsUser', email, USERTYPE.DORADCA, null, function (error, ret) {
                if (error) {
                    throwError(error.reason);
                } else {
                    if (ret == false) {
                        Meteor.call('serverCheckExistsUser', email, USERTYPE.CZLONEK, null, function (error, ret) {
                            if (error) {
                                throwError(error.reason);
                            } else {
                                if (ret == false) {
                                    Meteor.call('serverCheckExistsUserDraft',email, function (error, ret) {
                                        if (error) {
                                            throwError(error.reason);
                                        } else {
                                            if (ret == false) {
                                                var firstName = $(e.target).find('[name=firstName]').val();
                                                var lastName = $(e.target).find('[name=lastName]').val();

                                                Meteor.call('serverGenerateLogin', firstName, lastName, function (err, ret) {
                                                    if (!err) {

                                                        var idUser = null;
                                                        if (Meteor.userId())
                                                            idUser = Meteor.userId();
                                                        var newUser = [
                                                            {
                                                                email: $(e.target).find('[name=email]').val(),
                                                                login: '',
                                                                firstName: firstName,
                                                                lastName: lastName,
                                                                role: 'user',
                                                                city: $(e.target).find('[name=city]').val(),
                                                                userType: USERTYPE.DORADCA,
                                                                isExpectant: false,
                                                                uwagi: $(e.target).find('[name=uwagi]').val(),
                                                                pesel: ''
                                                            }];
                                                        // generating a login for the user
                                                        newUser[0].login = ret; //generateLogin ( newUser[0].firstName, newUser[0].lastName );

                                                        addUserDraftDoradca(newUser);
                                                    } else {
                                                        throwError(err.reason);
                                                    }
                                                });
                                            } else {
                                                throwError(TAPi18n.__('txv.ACCESS_EXIST'));
                                                document.getElementById('submitButton').disabled = false;
                                                return false;
                                            }
                                        }
                                    });
                                } else {
                                    throwError(TAPi18n.__('txv.USER_EXIST'));
                                    document.getElementById('submitButton').disabled = false;
                                    return false;
                                }
                            }
                        });
                    } else {
                        throwError(TAPi18n.__('txv.ACCESS_EXIST'));
                        document.getElementById('submitButton').disabled = false;
                        return false;
                    }
                }
            });
        }
    },
    'reset form': function () {
        Router.go('home');
    }
});

addUserDraftDoradca = function (newUser) {
    Meteor.call('addUserDraft', newUser, function (error, ret) {
        if (error) {
            throwError(error.reason);
        } else {
            addKwestiaOsobowaDoradca(ret, newUser);
        }
    });
};

addKwestiaOsobowaDoradca = function (idUserDraft,newUser) {
    var ZR = ZespolRealizacyjny.findOne({_id:'jjXKur4qC5ZGPQkgN'});
    var newZR = [{
        nazwa:ZR.nazwa,
        idZR:ZR._id,
        zespol:ZR.zespol
    }];
    Meteor.call('addImplemTeamDraft', newZR, function (error,ret) {
        if (error) {
            throwError(error.reason);
        } else {
            var uwagi = '';
            if (newUser[0].uwagi != null)
                uwagi = newUser[0].uwagi;

            var daneAplikanta = {
                fullName: newUser[0].firstName + ' ' + newUser[0].lastName,
                email: newUser[0].email,
                city: newUser[0].city,
                uwagi: uwagi
            };
            var newKwestia = [
                {
                    idUser: idUserDraft,
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: TAPi18n.__('txv.APPLYING') + newUser[0].firstName + ' ' + newUser[0].lastName,
                    wartoscPriorytetu: 0,
                    wartoscPriorytetuWRealizacji: 0,
                    idTemat: Temat.findOne({ })._id,
                    idRodzaj: Rodzaj.findOne({ })._id,
                    idZespolRealizacyjny: ret,
                    dataGlosowania: null,
                    krotkaTresc: TAPi18n.__('txv.APPLY_SYSTEM') + newUser[0].userType,
                    szczegolowaTresc: daneAplikanta,
                    isOption: false,
                    status: KWESTIA_STATUS.OSOBOWA,
                    typ: KWESTIA_TYPE.ACCESS_DORADCA
                }];
            Meteor.call('addKwestiaOsobowa', newKwestia, function (error, ret) {
                if (error) {
                    if (typeof Errors === 'undefined')
                        Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                    else {
                        throwError(error.reason);
                    }
                } else {
                    if (Meteor.userId())
                        Router.go('administracjaUserMain');
                    else
                        Router.go('home');
                    addPowiadomienieAplikacjaIssueFunction(ret,newKwestia[0].dataWprowadzenia);
                    przyjecieWnioskuConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej, daneAplikanta.email, 'doradztwo');
                    Meteor.call('sendApplicationConfirmation', idUserDraft,function (error) {
                        if (!error) {
                            Meteor.call('sendEmailAddedIssue', ret, getUserLanguage(), function (error) {
                                if (error) {
                                    var emailError = {
                                        idIssue: ret,
                                        type: NOTIFICATION_TYPE.NEW_ISSUE
                                    };
                                    Meteor.call('addEmailError', emailError);
                                }
                            });
                        } else {
                            var emailError = {
                                idIssue: ret,
                                idUserDraft: idUserDraft,
                                type: NOTIFICATION_TYPE.APPLICATION_CONFIRMATION
                            };
                            Meteor.call('addEmailError', emailError);
                        }

                    });
                }
            });
        }
    });
};

Template.advisorForm.helpers({
    nazwaOrganizacji: function () {
        return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji : 'SDD';
    }
});
