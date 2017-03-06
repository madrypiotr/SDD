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
                { key: 'dataWprowadzenia', label: TXV.DATE_OF_INTRO, tmpl: Template.dataUtwKwestia },
                { key: 'kwestiaNazwa', label: TXV.NAME_OF_ISSUES, tmpl: Template.opcjeNazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TXV.VAL_OF_PRIORITY, tmpl: Template.priorytetKwestia,sortOrder:1,sortDirection:'descending' },
                { key: 'idTemat', label: TXV.SUBJECT, tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: TXV.TYPE, tmpl: Template.rodzajKwestia },
                { key: 'status', label: TXV.STATUS, tmpl: Template.statusKwestia }
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