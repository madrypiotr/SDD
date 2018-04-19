/*
``client\views\account\`` czlonek_zwyczajny_form.js
## Rendering, events and helpers for the template czlonek_zwyczajny_form.html */


Template.czlonekZwyczajnyForm.rendered = function () {
    document.getElementById('submitZwyczajny').disabled = false;

    $('#userForm').validate({
        rules: {
            email: {
                email: true
            },
            confirmPassword: {
                equalTo: '#inputPassword'
            },
/* wyciete na okres testów ...
            pesel: {
                exactlength: 11,
                peselValidation: true,
                peselValidation2: true
            },
            ZipCode: {
                zipCodeValidation1: true,
                zipCodeValidation2: true
            },
*/			
            language: {
                isNotEmptyValue: true
            }
        },
        messages: {
            role: {
                required: fieldEmptyMessage
            },
            email: {
                required: fieldEmptyMessage,
                email: validEmailMessage
            },
            firstName: {
                required: fieldEmptyMessage
            },
            lastName: {
                required: fieldEmptyMessage
            },
/* wyciete na okres testów ...
            address: {
                required: fieldEmptyMessage
            },
            city: {
                required: fieldEmptyMessage
            },
            ZipCode: {
                required: fieldEmptyMessage
            },
            pesel: {
                required: fieldEmptyMessage
            },
*/			
            statutConfirmation: {
                required: fieldEmptyMessage()
            },
            language: {
                required: fieldEmptyMessage()
            }
        },
        highlight: highlightFunction,
        unhighlight: unhighlightFunction,
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.attr('name') == 'statutConfirmation')
                error.insertAfter(document.getElementById('statutConfirmationSpan'));
            else
                validationPlacementError(error, element);
        }
    });
};

Template.czlonekZwyczajnyForm.events({
    'submit form': function (e) {
        e.preventDefault();

        if ($('#userForm').valid()) {
            document.getElementById('submitZwyczajny').disabled = true;
            var email = $(e.target).find('[name=email]').val();

            Meteor.call('serverCheckExistsUserDraft', email, function (error, ret) {
                if (error) {
                    throwError(error.reason);
                } else {
                    if (ret == false) {
                        var idUser = Meteor.userId() || null;
                        var firstName = $(e.target).find('[name=firstName]').val();
                        var lastName = $(e.target).find('[name=lastName]').val();
                        var newUser = [{
                            email: $(e.target).find('[name=email]').val(),
                            login: '',
                            firstName: firstName,
                            lastName: lastName,
/* wycięte na okres testów ...
                            address: $(e.target).find('[name=address]').val(),
                            city: $(e.target).find('[name=city]').val(),
                            zip: $(e.target).find('[name=ZipCode]').val(),
                            pesel: $(e.target).find('[name=pesel]').val(),
*/
                            role: 'user',
                            userType: USERTYPE.CZLONEK,
                            uwagi: $(e.target).find('[name=uwagi]').val(),
                            language: $(e.target).find('[name=language]').val(),
                            isExpectant: false,
                            idUser: idUser
                        }];
                        if (idUser) {
                            addIssueOsobowa(newUser);
                        } else {
                            Meteor.call('serverCheckExistsUser', email, USERTYPE.DORADCA, function (error, ret) {
                                if (error) {
                                    throwError(error.reason);
                                } else {
                                    if (ret == false) {
                                        addIssueOsobowa(newUser);
                                    } else {
                                        throwError(TAPi18n.__('txv.USER_EXIST'));
                                        document.getElementById('submitZwyczajny').disabled = false;
                                        return false;
                                    }
                                }
                            });
                        }
                    } else {
                        throwError(TAPi18n.__('txv.ACCESS_EXIST'));
                        document.getElementById('submitZwyczajny').disabled = false;
                        return false;
                    }
                }
            });
        }
    },
    'reset form': function () {
        Router.go('home');
    },
    'click #statutBootbox': function () {
        bootbox.dialog({
            message: getRegulamin(),
            title: TAPi18n.__('txv.RULES_OF_THE_ORGANIZATION') + getNazwaOrganizacji(),
            buttons: {
                main: {
                    label: TAPi18n.__('txv.OK'),
                    className: 'btn-primary'
                }
            }
        });
    }
});

Template.czlonekZwyczajnyForm.helpers({
    'getLanguages': function () {
        return Languages.find({});
    },
    email: function () {
        return getEmail(this);
    },
    isNotEmpty: function () {
        return Meteor.userId() ? 'disabled' : '';
    },
    nazwaOrganizacji: function () {
        return Parametr.findOne() ? Parametr.findOne().nazwaOrganizacji : TAPi18n.__('txv.ORG_NAME');
    }
});

getRegulamin = function () {
    return Parametr.findOne() ? Parametr.findOne().regulamin : '';
};

addIssueOsobowa = function (newUser) {
    Meteor.call('serverCheckExistsUser', newUser[0].email, USERTYPE.CZLONEK, null, function (error, ret) {
        if (error) {
            throwError(error.reason);
        } else {
            if (ret == false) {
                var firstName = newUser[0].firstName;
                var lastName = newUser[0].lastName;
                Meteor.call('serverGenerateLogin', firstName, lastName, function (err, ret) {
                    if (!err) {
                        newUser[0].login = ret;
                        addUserDraft(newUser);
                    } else {
                        throwError(err.reason);
                    }
                });
            } else {
                throwError(TAPi18n.__('txv.USER_EXIST'));
                document.getElementById('submitZwyczajny').disabled = false;
                return false;
            }
        }
    });
};

addUserDraft = function (newUser) {
    Meteor.call('addUserDraft', newUser, function (error, ret) {
        if (error) {
            if (typeof Errors === 'undefined')
                Log.error(TAPi18n.__('txv.ERROR') + error.reason);
            else
                throwError(error.reason);
        } else {
            addKwestiaOsobowa(ret, newUser);
        }
    });
};

var addKwestiaOsobowa = function (idUserDraft, newUser) {
    var ZR = ZespolRealizacyjny.findOne({_id: 'jjXKur4qC5ZGPQkgN'});
    var newZR = [{
        nazwa: ZR.nazwa,
        idZR: ZR._id,
        zespol: ZR.zespol
    }];
    Meteor.call('addImplemTeamDraft', newZR, function (error, ret) {
        if (error) {
            throwError(error.reason);
        } else {
            const uwagi = newUser[0].uwagi != null ? newUser[0].uwagi : '';
            var daneAplikanta = {
                fullName: newUser[0].firstName + ' ' + newUser[0].lastName,
                email: newUser[0].email,
                pesel: newUser[0].pesel,
                city: newUser[0].city,
                zip: newUser[0].zip,
                address: newUser[0].address,
                uwagi: uwagi
            };
            var newKwestia = [
                {
                    idUser: idUserDraft,
                    dataWprowadzenia: new Date(),
                    kwestiaNazwa: TAPi18n.__('txv.APPLYING') + newUser[0].firstName + ' ' + newUser[0].lastName,
                    wartoscPriorytetu: 0,
                    wartoscPriorytetuWRealizacji: 0,
                    idTemat: Temat.findOne({})._id,
                    idRodzaj: Rodzaj.findOne({})._id,
                    idZespolRealizacyjny: ret,
                    dataGlosowania: null,
                    krotkaTresc: TAPi18n.__('txv.APPLY_SYSTEM') + newUser[0].userType,
                    szczegolowaTresc: daneAplikanta,
                    isOption: false,
                    status: KWESTIA_STATUS.OSOBOWA,
                    typ: KWESTIA_TYPE.ACCESS_ZWYCZAJNY
                }];
            Meteor.call('addKwestiaOsobowa', newKwestia, function (error, ret) {
                if (error) {
                    throwError(error.reason);
                } else {
                    if (Meteor.userId())
                        Router.go('administracjaUserMain');
                    else
                        Router.go('home');
                    przyjecieWnioskuConfirmation(Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej, daneAplikanta.email, 'członkowstwo');
                    addPowiadomienieAplikacjaIssueFunction(ret, newKwestia[0].dataWprowadzenia);
                    if (newUser[0].idUser != null) {
                        // If there is already a user, he is an advisor, then send him a confirmation in the message
                        addPowiadomienieAplikacjaRespondFunction(ret, newKwestia[0].dataWprowadzenia, NOTIFICATION_TYPE.APPLICATION_CONFIRMATION);
                    }
                    Meteor.call('sendApplicationConfirmation', idUserDraft, Etc.getUserLanguage(), function (error) {
                        if (!error) {
                            Meteor.call('sendEmailAddedIssue', ret, Etc.getUserLanguage(), function (error) {
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

addPowiadomienieAplikacjaIssueFunction = function (idKwestia, dataWprowadzenia) {
    var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
    var idNadawca = null;
    if (Meteor.userId())
        idNadawca = Meteor.userId();
    users.forEach(function (user) {
        var newPowiadomienie = {
            idOdbiorca: user._id,
            idNadawca: idNadawca,
            dataWprowadzenia: dataWprowadzenia,
            tytul: '',
            powiadomienieTyp: NOTIFICATION_TYPE.NEW_ISSUE,
            tresc: '',
            idKwestia: idKwestia,
            czyAktywny: true,
            czyOdczytany: false
        };
        Meteor.call('addPowiadomienie', newPowiadomienie, function (error) {
            if (error)
                throwError(error.reason);
        });
    });
};

addPowiadomienieAplikacjaRespondFunction = function (idKwestia, dataWprowadzenia, typ) {
    var newPowiadomienie = {
        idOdbiorca: Meteor.userId(),
        idNadawca: null,
        dataWprowadzenia: dataWprowadzenia,
        tytul: '',
        powiadomienieTyp: typ,
        tresc: '',
        idKwestia: idKwestia,
        czyAktywny: true,
        czyOdczytany: false
    };
    Meteor.call('addPowiadomienie', newPowiadomienie, function (error) {
        if (error)
            throwError(error.reason);
    });
};
