Template.hibernowaneList.events({
    'click .glyphicon-trash': function () {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-pencil': function () {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-repeat': function () {
        Session.set('kwestiaInScope', this);
    },
    'click .glyphicon-info-sign': function () {
        Session.set('kwestiaInScope', this);
    }
});
Template.hibernowaneList.helpers({
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'dataWprowadzenia', label: TAPi18n.__('txv.DATE_OF_INTRO'), tmpl: Template.dataUtwKwestia},
                {key: 'kwestiaNazwa', label: TAPi18n.__('txv.NAME'), tmpl: Template.nazwaKwestiiHibernowaneLink},
                {key: 'wartoscPriorytetu', label: TAPi18n.__('glob.Priority'), tmpl: Template.priorytetKwestia,sortOrder:1,sortDirection:'ascending'},
                {key: '', label: TAPi18n.__('glob.Subject'), tmpl: Template.tematKwestiiHibernowane},
                {key: '', label: TAPi18n.__('glob.Type'), tmpl: Template.rodzajKwestiiHibernowane},
                {key: 'status', label: TAPi18n.__('txv.STATUS')}
            ]
        };
    },
    HibernowaneList: function () {
        return Kwestia.find({
            czyAktywny: true,
            status: {
                $in: [
                    //KWESTIA_STATUS.ARCHIWALNA
                    KWESTIA_STATUS.HIBERNOWANA
                ]
            }
        });
    },
    'hibernowaneListCount': function () {
        var count = Kwestia.find({
            czyAktywny: true,
            status: {
                $in: [
                    //KWESTIA_STATUS.ARCHIWALNA,
                    KWESTIA_STATUS.HIBERNOWANA
                ]
            }
        }).count();
        return count > 0 ? true : false;
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

Template.hibernowaneList.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
};

Template.tematKwestiiHibernowane.helpers({
    'getTemat': function (id) {
        if (this.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.BELONGS_TO_THE_SYSTEM');
        var item = Temat.findOne({_id: id});
        return !!item && !!item.nazwaTemat ? item.nazwaTemat : id;
    }
});

Template.rodzajKwestiiHibernowane.helpers({
    'getRodzaj': function (id) {
        if (this.typ == KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE)
            return TAPi18n.__('txv.TECHNICAL');
        var item = Rodzaj.findOne({_id: id});
        return !!item && !!item.nazwaRodzaj ? item.nazwaRodzaj : id;
    }
});
