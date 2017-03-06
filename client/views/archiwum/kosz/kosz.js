Template.kosz.helpers({
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'kwestiaNazwa', label: TXV.NAME_OF_ISSUES, tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TXV.PRIORITY, tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'idTemat', label: TXV.SUBJECT, tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: TXV.TYPE, tmpl: Template.rodzajKwestia }
            ]
        };
    },
    KoszList: function () {
        return Kwestia.find({czyAktywny: false});
    },
    KoszListCount: function () {
        var ile = Kwestia.find({czyAktywny: false}).count();
        return ile > 0 ? true : false;
    }
});

Template.dataKoniecKwestia.helpers({
    date: function () {
        var d = this.dataGlosowania;
        if (d) return moment(d).format("DD-MM-YYYY HH:mm");
    }
});