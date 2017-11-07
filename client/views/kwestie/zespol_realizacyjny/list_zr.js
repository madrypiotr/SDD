Template.listZespolRealizacyjnyModal.helpers({
});

Template.listZespolRealizacyjnyModalInner.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwa', label: TAPi18n.__('txv.NAME_OF_TEAM')},
                {key: 'zespol', label: TAPi18n.__('txv.SPECIF_OF_TEAM'), tmpl: Template.zespolTemplate},
                {key: 'options', label: '', tmpl: Template.zespolOptionsTemplate}
            ]
        };
    },
    ZRList: function () {
        return ZespolRealizacyjny.find({czyAktywny: true});
    }
});

Template.zespolTemplate.helpers({
    zespolR: function () {
        var tab = [];
        if (this.zespol) {
            for (var i = 0; i < this.zespol.length; i++) {
                var z = this.zespol[i];
                if (z) {
                    const user = Users.findOne({_id: z});
                    const foundName = user && user.profile && user.profile.fullName;
                    if (foundName) {
                        tab.push(' ' + foundName);
                    }
                }
            }
        }
        return tab;
    }
});

Template.zespolOptionsTemplate.rendered = function () {
    $('#powolajZR').css('visibility', 'visible');
};

Template.listZespolRealizacyjnyModalInner.events({
    'click #powolajZR': function () {
        //jezeli jest w zepsole,powolaj
        if (isUserInZRNotification(this._id) == false) {//jezeli jestem w  takowym zespole
            $('#powolajZR').css('visibility', 'hidden');
            powolajZRFunction(Session.get('idKwestia'), this._id);
        }
        $('#powolajZR').css('visibility', 'visible');
    }
});
