Template.archiwumList.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-repeat': function (event, template) {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-info-sign': function (event, template) {
        Session.set('kwestiaInScope', this);
    }
});
Template.archiwumList.helpers({
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'dataWprowadzenia', label: TAPi18n.__('txv.DATE_OF_INTRO'), tmpl: Template.dataUtwKwestia },
                { key: 'kwestiaNazwa', label: TAPi18n.__('txv.NAME'), tmpl: Template.nazwaKwestiiArchiwumLink },
                { key: 'wartoscPriorytetu', label: TAPi18n.__('glob.Priority'), tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'ascending'},
                { key: '', label: TAPi18n.__('glob.Subject'), tmpl: Template.tematKwestiiArchiwum },
                { key: '', label: TAPi18n.__('glob.Type'), tmpl: Template.rodzajKwestiiArchiwum },
                { key: 'status', label: TAPi18n.__('txv.STATUS') }
            ]
        };
    },
    'isAdminUser': function () {
        return IsAdminUser();
    },
    'tematNazwa': function () {
        return Temat.findOne({_id: this.idTemat});
    },
    'rodzajNazwa': function () {
        return Rodzaj.findOne({_id: this.idRodzaj});
    }
});

Template.archiwum.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
}

Template.tematKwestiiArchiwum.helpers({
    'getTemat': function (id) {
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.BELONGS_TO_THE_SYSTEM');
        var item = Temat.findOne({_id: id});
        return !!item && !!item.nazwaTemat ? item.nazwaTemat : id;
    }
});

Template.rodzajKwestiiArchiwum.helpers({
    'getRodzaj': function (id) {
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.TECHNICAL');
        var item = Rodzaj.findOne({_id: id});
        return !!item && !!item.nazwaRodzaj ? item.nazwaRodzaj : id;
    }
});
