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
                { key: 'dataWprowadzenia', label: TXV.DATE_OF_INTRO, tmpl: Template.dataUtwKwestia },
                { key: 'kwestiaNazwa', label: TXV.NAME, tmpl: Template.nazwaKwestiiArchiwumLink },
                { key: 'wartoscPriorytetu', label: TXV.PRIORITY, tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'ascending'},
                { key: '', label: TXV.TEMAT, tmpl: Template.tematKwestiiArchiwum },
                { key: '', label: TXV.RODZAJ, tmpl: Template.rodzajKwestiiArchiwum },
                { key: 'status', label: TXV.STATUS }
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
            return TXV.SYSTEMOWA;
        var item = Temat.findOne({_id: id});
        return !!item && !!item.nazwaTemat ? item.nazwaTemat : id;
    }
});

Template.rodzajKwestiiArchiwum.helpers({
    'getRodzaj': function (id) {
        if(this.typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TXV.TECHNICAL;
        var item = Rodzaj.findOne({_id: id});
        return !!item && !!item.nazwaRodzaj ? item.nazwaRodzaj : id;
    }
});