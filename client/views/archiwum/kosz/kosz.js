Template.kosz.helpers({
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'kwestiaNazwa', label: TXV.NAZ_KWESTI, tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TXV.PRIORITY, tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'idTemat', label: TXV.TEMAT, tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: TXV.RODZAJ, tmpl: Template.rodzajKwestia }
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