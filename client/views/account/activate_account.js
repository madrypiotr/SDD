/*
``client\views\account\``activate_account.js
## Rendering and helper for the template activate_account.html */


Template.activateAccount.rendered = function () {
    // gets from: `` lib\ `` router.js
    var currentRoute = Router.current().params;
    // see publications: `` server\ `` publications.js
    var userD = UsersDraft.findOne({linkAktywacyjny: currentRoute.linkAktywacyjny});
    if (userD) {
        var clickedLinkCount = userD.licznikKlikniec + 1;
        // leads to: `` server\methods\ `` usersDraft.js
        Meteor.call('updateLicznikKlikniec', userD._id, clickedLinkCount,
            function (error) {
                if (!error) {
                    var userDraft = UsersDraft.findOne({
                        linkAktywacyjny: currentRoute.linkAktywacyjny,
                        czyAktywny: true
                    });
                    if (userDraft) {
                        const language = userDraft.profile.language;
                        // leads to: `` server\methods\``users.js
                        Meteor.call('serverGenerateLogin', userDraft.profile.firstName, userDraft.profile.lastName,
                            /**    Feature appointing a new user
                             * @param err - ewentualny blad ... opis opis opis ...
                             * @param ret - zwrot z metody "serverGenerateLogin" ... opis opis opis opis opis opis ...
                             */
                            function (err, ret) {
                                if (!err) {
                                    var newUser = [{
                                        email: userDraft.email,
                                        login: '',
                                        firstName: userDraft.profile.firstName,
                                        lastName: userDraft.profile.lastName,
                                        address: userDraft.profile.address,
                                        zip: userDraft.profile.zip,
                                        role: 'user',
                                        userType: userDraft.profile.userType,
                                        uwagi: userDraft.profile.uwagi,
                                        language,
                                        city: userDraft.profile.city,
                                        pesel: userDraft.profile.pesel
                                    }];
                                    newUser[0].login = ret;
                                    newUser[0].fullName = newUser[0].firstName + ' ' + newUser[0].lastName;
                                    newUser[0].password = CryptoJS.MD5(newUser[0].login).toString();
                                    newUser[0].confirm_password = newUser[0].password;
                                    Meteor.call('addUser', newUser, function (error, ret) {
                                        if (error) throwError(error.reason);
                                        else {
                                            var idUser = ret;
                                            Meteor.call('removeUserDraftAddNewIdUser', userDraft._id, idUser, function (error) {
                                                if (error) throwError(error.reason);
                                                else {
                                                    Meteor.call('sendFirstLoginData', idUser, newUser[0].password, language, function (error) {
                                                        if (error) {
                                                            // ``txv`` (notice that a link to the login failed because of a mail server error)
                                                            bootbox.alert(
                                                                TAPi18n.__('txv.ALERT_LOG1', null, language) +
                                                                TAPi18n.__('txv.ALERT_LOG2', null, language) +
                                                                TAPi18n.__('txv.ALERT_LOG3', null, language)
                                                            );
                                                            Meteor.call('addEmailError', {
                                                                idUserDraft: userDraft._id,
                                                                type: NOTIFICATION_TYPE.FIRST_LOGIN_DATA
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else throwError(err.reason);
                            }
                        );
                    }
                } else throwError(error.reason);
            }
        );
    }
};
/*
### Account Activation Template helpers
*/
Template.activateAccount.helpers({
    activatedAccountRightNow: function () {
        var currentRoute = Router.current().params;
        var userDraft = UsersDraft.findOne({linkAktywacyjny: currentRoute.linkAktywacyjny});
        if (userDraft)
            return userDraft.licznikKlikniec == 1 ? true : false;
        return true;
    },
    notActivatedAccount: function () {
        var currentRoute = Router.current().params;
        var userDraft = UsersDraft.findOne({linkAktywacyjny: currentRoute.linkAktywacyjny});
        if (userDraft)
            return userDraft.czyAktywny == true && userDraft.licznikKlikniec == 0 ? true : false;
        return true;
    },
    link: function () {
        return Meteor.absoluteUrl() + 'account/login';
    },
    notFound: function () {
        var currentRoute = Router.current().params;
        if (UsersDraft.findOne({linkAktywacyjny: currentRoute.linkAktywacyjny})) {
            return false;
        }
        return true;

    }
});
