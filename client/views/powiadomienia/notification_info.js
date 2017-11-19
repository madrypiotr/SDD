Template.notificationInfo.rendered = function () {
    var powiadomienie = Powiadomienie.findOne({_id:Template.instance().data._id});
    if (powiadomienie.czyOdczytany == false && powiadomienie.powiadomienieTyp != NOTIFICATION_TYPE.ISSUE_NO_PRIORITY)
        Meteor.call('setOdczytanePowiadomienie',powiadomienie._id,true,function (error) {
            if (error)
                throwError(error.reason);
        });
};

Template.notificationInfo.helpers({
    notificationTypeMessage: function () {
        return this.powiadomienieTyp == NOTIFICATION_TYPE.MESSAGE_FROM_USER ? true : false;
    },
    notificationTypeNewIssue: function () {
        return this.powiadomienieTyp == NOTIFICATION_TYPE.NEW_ISSUE ? true : false;
    },
    notificationTypeLobbingMessage: function () {
        return this.powiadomienieTyp == NOTIFICATION_TYPE.LOOBBING_MESSAGE ? true : false;
    },
    notificationTypeVoteStarted: function () {
        return this.powiadomienieTyp == NOTIFICATION_TYPE.VOTE_BEGINNING ? true : false;
    },
    notificationTypeNoActivity: function () {
        return this.powiadomienieTyp == NOTIFICATION_TYPE.ISSUE_NO_PRIORITY ? true : false;
    },
    notificationTypeApplicationConfirmationAcceptedRejected: function () {
        return _.contains([NOTIFICATION_TYPE.APPLICATION_CONFIRMATION,NOTIFICATION_TYPE.APPLICATION_ACCEPTED,
            NOTIFICATION_TYPE.APPLICATION_REJECTED], this.powiadomienieTyp) ? true : false;
    },
    notificationTypeLackOfRealizationReport: function () {
        return this.powiadomienieTyp == NOTIFICATION_TYPE.LACK_OF_REALIZATION_REPORT ? true : false;
    }
});

Template.notificationInfo.events({
    'click #backToNotificationList': function (e) {
        e.preventDefault();
        Router.go('notification_list');
    }
});
Template.notificationNewMessage.helpers({
    powiadomienie: function (idPowiadomienie) {
        return getNotification(idPowiadomienie);
    },
    dataWprowadzenia: function () {
        return formatDate(this.dataWprowadzenia);
    },
    sender: function () {
        var user = Users.findOne({_id:this.idNadawca});
        return user ? user.profile.fullName : null;
    },
    userData: function () {
        return Meteor.user().profile.fullName;
    },
    organisationName: function () {
        return Parametr.findOne().nazwaOrganizacji;
    }
});
Template.notificationNewIssue.helpers({
    powiadomienie: function (idPowiadomienie) {
        return getNotification(idPowiadomienie);
    },
    actualKwestia: function (idKwestia) {
        return getIssue(idKwestia);
    },
    userData: function () {
        return Meteor.user().profile.fullName;
    },
    organisationName: function () {
        return Parametr.findOne().nazwaOrganizacji;
    },
    temat: function () {
        if (this.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.BELONGS_TO_THE_SYSTEM');
        var temat = Temat.findOne({_id:this.idTemat});
        return temat ? temat.nazwaTemat : '';
    },
    rodzaj: function () {
        if (this.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.TECHNICAL');
        var rodzaj = Rodzaj.findOne({_id:this.idRodzaj});
        return rodzaj ? rodzaj.nazwaRodzaj : '';
    }
});

Template.notificationLackOfRealizationReport.helpers({
    powiadomienie: function (idPowiadomienie) {
        return getNotification(idPowiadomienie);
    },
    actualKwestia: function (idKwestia) {
        return getIssue(idKwestia);
    },
    userData: function () {
        return Meteor.user().profile.fullName;
    },
    organisationName: function () {
        return Parametr.findOne().nazwaOrganizacji;
    },
    temat: function () {
        if (this.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.BELONGS_TO_THE_SYSTEM');
        var temat = Temat.findOne({_id:this.idTemat});
        return temat ? temat.nazwaTemat : '';
    },
    rodzaj: function () {
        if (this.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.TECHNICAL');
        var rodzaj = Rodzaj.findOne({_id:this.idRodzaj});
        return rodzaj ? rodzaj.nazwaRodzaj : '';
    },
    czlonekZR: function (zespol) {
        var array = [];
        _.each(zespol,function (czlonekId) {
            var user = Users.findOne({_id:czlonekId});
            var obj = {
                fullName:user.profile.fullName,
                url:Meteor.absoluteUrl() + 'new_message/' + czlonekId
            };
            array.push(obj);
        });
        return array;
    }
});

Template.notificationApplicationAnswer.helpers({
    powiadomienie: function (idPowiadomienie) {
        return getNotification(idPowiadomienie);
    },
    actualKwestia: function (idKwestia) {
        return getIssue(idKwestia);
    },
    userData: function () {
        return Meteor.user().profile.fullName;
    },
    organisationName: function () {
        return Parametr.findOne().nazwaOrganizacji;
    },
    applicationConfirmation: function () {
        return this.powiadomienieTyp == NOTIFICATION_TYPE.APPLICATION_CONFIRMATION ? true : false;
    },
    applicationRejected: function () {
        return this.powiadomienieTyp == NOTIFICATION_TYPE.APPLICATION_REJECTED ? true : false;
    },
    userTypeData: function () {
        return this.typ == KWESTIA_TYPE.ACCESS_ZWYCZAJNY ? TAPi18n.__('txv.ORD_MEMBER') : TAPi18n.__('txv.HONORARY_MEMBER');
    }
});

Template.notificationLobbingMessage.helpers({
    powiadomienie: function (idPowiadomienie) {
        return getNotification(idPowiadomienie);
    },
    actualKwestia: function (idKwestia) {
        return getIssue(idKwestia);
    },
    userData: function () {
        return Meteor.user().profile.fullName;
    },
    organisationName: function () {
        return Parametr.findOne().nazwaOrganizacji;
    },
    sender: function () {
        var user = Users.findOne({_id:this.idNadawca});
        return user ? user.profile.fullName : null;
    },
    temat: function () {
        if (this.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.BELONGS_TO_THE_SYSTEM');
        var temat = Temat.findOne({_id:this.idTemat});
        return temat ? temat.nazwaTemat : '';
    },
    rodzaj: function () {
        if (this.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.TECHNICAL');
        var rodzaj = Rodzaj.findOne({_id:this.idRodzaj});
        return rodzaj ? rodzaj.nazwaRodzaj : '';
    }
});

Template.notificationNoActivity.helpers({
    powiadomienie: function (idPowiadomienie) {
        return getNotification(idPowiadomienie);
    },
    actualKwestia: function (idKwestia) {
        return getIssue(idKwestia);
    },
    userData: function () {
        return Meteor.user().profile.fullName;
    },
    organisationName: function () {
        return Parametr.findOne().nazwaOrganizacji;
    }
});

Template.notificationVoteStarted.helpers({
    powiadomienie: function (idPowiadomienie) {
        return getNotification(idPowiadomienie);
    },
    actualKwestia: function (idKwestia) {
        return getIssue(idKwestia);
    },
    userData: function () {
        return Meteor.user().profile.fullName;
    },
    organisationName: function () {
        return Parametr.findOne().nazwaOrganizacji;
    },
    sender: function () {
        var user = Users.findOne({_id:this.idNadawca});
        return user ? user.profile.fullName : null;
    },
    temat: function () {
        if (this.kwestia.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.BELONGS_TO_THE_SYSTEM');
        var temat = Temat.findOne({_id:this.kwestia.idTemat});
        return temat ? temat.nazwaTemat : '';
    },
    rodzaj: function () {
        if (this.kwestia.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.TECHNICAL');
        var rodzaj = Rodzaj.findOne({_id:this.kwestia.idRodzaj});
        return rodzaj ? rodzaj.nazwaRodzaj : '';
    },
    nadanoPriorytet: function (idOdbiorca) {
        var glosujacy = _.pluck(this.kwestia.glosujacy,'idUser');
        return _.contains(glosujacy,idOdbiorca) ? true : false;
    },
    mojPriorytet: function (idOdbiorca) {
        var myObj = _.reject(this.kwestia.glosujacy,function (obj) {
            return obj.idUser != idOdbiorca;
        });
        return myObj[0] ? myObj[0].value : null;
    },
    dataGlosowania: function () {
        const parametr = Parametr.findOne();
        return moment(this.kwestia.dataGlosowania).add(parametr && parametr.voteDuration || 0, 'hours').format('DD-MM-YYYY, HH:mm');
    },
    attendance: function () {
        return this.kwestia.glosujacy.length;
    },
    kworum: function () {
        if (this.kwestia.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return liczenieKworumZwykle();

        var rodzaj = Rodzaj.findOne({_id: this.kwestia.idRodzaj});
        return rodzaj.rodzajNazwa == 'Statutowe' ? liczenieKworumStatutowe() : liczenieKworumZwykle();

        return rodzaj ? rodzaj.nazwaRodzaj : '';
    }
});
formatDate = function (date) {
    return moment(date).format('DD-MM-YYYY, HH:mm');
};
getNotification = function (idPowiadomienie) {
    return Powiadomienie.findOne({_id:idPowiadomienie}) ? Powiadomienie.findOne({_id:idPowiadomienie}) : null;
};
getIssue = function (idKwestia) {
    return Kwestia.findOne({_id:idKwestia}) ? Kwestia.findOne({_id:idKwestia}) : null;
};
getUserDraft = function (idUserDraft) {
    return UsersDraft.findOne({_id:idUserDraft}) ? UsersDraft.findOne({_id:idUserDraft}) : null;
};
