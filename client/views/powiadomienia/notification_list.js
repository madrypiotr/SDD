Template.notificationList.created = function () {
};

Template.notificationList.rendered = function () {
};
Template.notificationList.helpers({
    'settings': function () {
        var self = Template.instance();
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'powiadomienieTyp', label: TAPi18n.__('glob.Subject'),tmpl: Template.tematLink,sortOrder: 1, sortDirection: 'descending'},
                {key: 'dataWprowadzenia', label: TAPi18n.__('txv.DATA'), tmpl: Template.dataWpr,sortOrder: 0, sortDirection: 'descending'}
            ],
            rowClass: function (item) {
                if (item.czyOdczytany == false)
                    return 'danger';
            }
        };
    }
});
Template.dataWpr.helpers({
    date: function () {
        var d = this.dataWprowadzenia;
        if (d) return moment(d).format('DD-MM-YYYY, HH:mm');
    }
});
Template.tematLink.helpers({
    notificationTitle: function () {
        var idNadawca = this.idNadawca;
        var idKwestia = this.idKwestia;
        return getTopicTypeNotification(this.powiadomienieTyp,idNadawca,idKwestia);
    }
});

getTopicTypeNotification = function (powiadomienieTyp,idNadawca,idKwestia) {
    switch (powiadomienieTyp) {
    case NOTIFICATION_TYPE.MESSAGE_FROM_USER: {
        var user = Users.findOne({_id: idNadawca});
        return powiadomienieTyp + ' ' + user.profile.fullName;break;
    }
    case NOTIFICATION_TYPE.NEW_ISSUE: {//sth wrong,when applies guest
        var kwestia = Kwestia.findOne({_id:idKwestia});
        return powiadomienieTyp + ': ' + kwestia.kwestiaNazwa;break;
    }
    case NOTIFICATION_TYPE.LOOBBING_MESSAGE: {
        var user = Users.findOne({_id:idNadawca});
        if (user)
            return powiadomienieTyp + TAPi18n.__('txv.BY') + user.profile.fullName;break;
    }
    default : return powiadomienieTyp;
    }
};
