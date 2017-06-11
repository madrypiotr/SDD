Template.opcjeList.helpers({
    OpcjeList: function () {
        var k = Kwestia.find({czyAktywny: true, idParent: this.idParent});
        return k ? k :false;
    },
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: false,
            showNavigation: 'never',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'dataWprowadzenia', label: TAPi18n.__('txv.DATE_OF_INTRO'), tmpl: Template.dataUtwKwestia },
                { key: 'kwestiaNazwa', label: TAPi18n.__('informacjeKwestiaArchiwum.ikaNameIssue'), tmpl: Template.opcjeNazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TAPi18n.__('txv.VAL_OF_PRIORITY'), tmpl: Template.priorytetKwestia,sortOrder:1,sortDirection:'descending' },
                { key: 'idTemat', label: TAPi18n.__('glob.globSubject'), tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: TAPi18n.__('glob.globType'), tmpl: Template.rodzajKwestia },
                { key: 'status', label: TAPi18n.__('txv.STATUS'), tmpl: Template.statusKwestia }
            ],
            rowClass: function (item) {
                if (item.status==KWESTIA_STATUS.ARCHIWALNA) {
                    return 'danger';
                }
            }
        };
    }
});
Template.opcjeNazwaKwestiLink.helpers({
    isArchiwalna:function(){
        return this.status==KWESTIA_STATUS.ARCHIWALNA ? true :false;
    },
    isKwestiaMain:function(){
        return Template.instance().data._id==Session.get("idKwestia") ? true : false;
    }
});
