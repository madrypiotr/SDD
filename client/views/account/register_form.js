/*
``client\views\account\`` register_form.js
## Rendering, events and helpers for the template register_form.html */

Template.registerForm.rendered = function () {
    var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
    if (users.count() >= 5) {
        document.getElementById('submitRegistration').disabled = false;
    }
    $('#dataUrodzeniaDatePicker').datetimepicker({
        sideBySide: true,
        format: 'DD/MM/YYYY'
    });

    $('#userForm').validate({
        rules: {
            password: {
                minlength: 6
            },
            email: {
                email: true
            },
            confirmPassword: {
                equalTo: '#inputPassword'
            },
            pesel: {
                exactlength: 11,
                peselValidation: true,
                peselValidation2: true
            },
            ZipCode: {
                zipCodeValidation1: true,
                zipCodeValidation2: true
            },
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
            password: {
                required: fieldEmptyMessage,
                minlength: () => minLengthMessage(6)
            },
            confirmPassword: {
                equalTo: equalToMessage
            },
            address: {
                required: fieldEmptyMessage
            },
            ZipCode: {
                required: fieldEmptyMessage
            },
            pesel: {
                required: fieldEmptyMessage
            },
            city: {
                required: fieldEmptyMessage
            },
            language: {
                required: fieldEmptyMessage
            },
            statutConfirmation: {
                required: fieldEmptyMessage
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

    Tracker.autorun(() => {
        Etc.getUserLanguage();
        $('#userForm').valid();
    });
};

Template.registerForm.events({
    'submit form': function (e) {
        e.preventDefault();
        if ($('#userForm').valid()) {
            document.getElementById('submitRegistration').disabled = true;
            // supplement the temporary table with the form data
            var firstName = $(e.target).find('[name=firstName]').val();
            var lastName = $(e.target).find('[name=lastName]').val();
            var email = $(e.target).find('[name=email]').val();
            Meteor.call('serverCheckExistsUser', email, USERTYPE.CZLONEK, null, function (error, ret) {
                if (error) {
                    throwError(error.reason);
                } else {
                    if (ret == false) {
                        Meteor.call('serverCheckExistsUserDraft', email, function (error, ret) {
                            if (error) {
                                throwError(error.reason);
                            } else {
                                if (ret == false) {
                                    Meteor.call('serverGenerateLogin', firstName, lastName, function (err, ret) {
                                        if (!err) {
                                            var newUser = [
                                                {
                                                    email: email,
                                                    login: '',
                                                    firstName: firstName,
                                                    lastName: lastName,
                                                    password: $(e.target).find('[name=password]').val(),
                                                    confirm_password: $(e.target).find('[name=confirmPassword]').val(),
                                                    address: $(e.target).find('[name=address]').val(),
                                                    zip: $(e.target).find('[name=ZipCode]').val(),
                                                    role: 'user',
                                                    userType: USERTYPE.CZLONEK,
                                                    uwagi: $(e.target).find('[name=uwagi]').val(),
                                                    language: $(e.target).find('[name=language]').val(),
                                                    city: $(e.target).find('[name=city]').val(),
                                                    pesel: $(e.target).find('[name=pesel]').val()
                                                }];
                                            // generating a login for the user
                                            newUser[0].login = ret;
                                            newUser[0].fullName = newUser[0].firstName + ' ' + newUser[0].lastName;
                                            var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
                                            if (users.count() < 5) {
                                                Meteor.call('addUser', newUser, function (error, ret) {
                                                    if (error) {
                                                        // optionally use a meteor errors package
                                                        if (typeof Errors === 'undefined')
                                                            Log.error('Error: ' + error.reason);
                                                        else {
                                                            throwError(error.reason);
                                                        }
                                                    } else {
                                                        // if correct data
                                                        var addedUser = ret;
                                                        Meteor.loginWithPassword(newUser[0].login, newUser[0].password, function (err) {
                                                            if (err) {
                                                                throwError(TAPi18n.__('txv.INCOR_LOGIN_DET'));
                                                            } else {
                                                                var zespol = ZespolRealizacyjny.findOne({_id: 'jjXKur4qC5ZGPQkgN'});
                                                                if (zespol) {
                                                                    if (zespol.zespol && zespol.zespol.length < 3) {
                                                                        var ZR = zespol.zespol.slice();
                                                                        ZR.push(addedUser);

                                                                        if (zespol.zespol && zespol.zespol.length == 0) {
                                                                            Meteor.call('updateCzlonkowieZRProtector', zespol._id, ZR, addedUser, function (error, ret) {
                                                                                if (error) {
                                                                                    // optionally use a meteor errors package
                                                                                    if (typeof Errors === 'undefined')
                                                                                        Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                                                                                    else {
                                                                                        throwError(error.reason);
                                                                                    }
                                                                                }
                                                                            });
                                                                        } else {
                                                                            Meteor.call('updateCzlonkowieZR', zespol._id, ZR, function (error, ret) {
                                                                                if (error) {
                                                                                    // optionally use a meteor errors package
                                                                                    if (typeof Errors === 'undefined')
                                                                                        Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                                                                                    else {
                                                                                        throwError(error.reason);
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                }
                                                                if (Meteor.loggingIn()) {
                                                                    Router.go('home');
                                                                }
                                                                bootbox.dialog({
                                                                    message: TAPi18n.__('txv.YOUR_LOGIN') + newUser[0].login,
                                                                    title: TAPi18n.__('txv.HELLO') + newUser[0].firstName,
                                                                    buttons: {
                                                                        main: {
                                                                            label: TAPi18n.__('txv.OK'),
                                                                            className: 'btn-primary'
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                        addKwestiaOsobowa(addedUser, newUser);
                                                    }
                                                });
                                            } else {
                                                bootbox.alert(TAPi18n.__('txv.REG_NOT_POSS'));
                                            }
                                        } else {
                                            throwError(err.reason);
                                        }
                                    });
                                } else {
                                    throwError(TAPi18n.__('txv.ACCESS_EXIST'));
                                    document.getElementById('submitRegistration').disabled = false;
                                    return false;
                                }
                            }
                        });
                    } else {
                        throwError(TAPi18n.__('txv.USER_EXIST'));
                        document.getElementById('submitRegistration').disabled = false;
                        return false;
                    }
                }
            });
        }
    },
    'reset form': function () {
        Router.go('listUsers');
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

Template.registerForm.helpers({
    'lessThanFiveUsers': function () {
        const param = Parametr.findOne();
        const regStart = param && param.regStart || 5;

        var users = Users.find({'profile.userType': USERTYPE.CZLONEK});
        //var users=Users.find ();
        return !!users && users.count() < regStart;
    },
    'getLanguages': function () {
        return Languages.find({}).map(function (lang) {
            return {
                shortName: lang.shortName,
                languageName: TAPi18n.__('listLanguages.' + lang.languageName)
            };
        });
    }
});

var addKwestiaOsobowa = function (idUser, newUser) {
    const ZR = ZespolRealizacyjny.findOne({_id: 'jjXKur4qC5ZGPQkgN'});
    const newZR = [{
        nazwa: ZR.nazwa,
        idZR: ZR._id,
        zespol: ZR.zespol
    }];
    Meteor.call('addImplemTeamDraft', newZR, function (error, ret) {
        if (error) {
            throwError(error.reason);
        } else {
            const uwagi = newUser[0].uwagi != null ? newUser[0].uwagi : '';
            const daneAplikanta = {
                fullName: newUser[0].firstName + ' ' + newUser[0].lastName,
                email: newUser[0].email,
                pesel: newUser[0].pesel,
                city: newUser[0].city,
                zip: newUser[0].zip,
                address: newUser[0].address,
                uwagi: uwagi
            };
            const newKwestia = [{
                idUser: idUser,
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
                }
            });
        }
    });
};
