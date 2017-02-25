Template.glosowanie.helpers({
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'dataGlosowania', label: TXV.DATE_OF_VOTE, tmpl: Template.dataGlosowaniaKwestia ,sortOrder:0,sortDirection:'ascending'},
                { key: 'kwestiaNazwa', label: TXV.NAZ_KWESTI, tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TXV.PRIORITY, tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'idTemat', label: TXV.TEMAT, tmpl: Template.tematKwestia},
                { key: 'idRodzaj', label: TXV.RODZAJ, tmpl: Template.rodzajKwestia}
            ]
        };
    }
});

Template.dataGlosowaniaKwestia.helpers({
    date: function () {
        var d = this.dataGlosowania;
        if (d) return moment(d).format("DD-MM-YYYY HH:mm");
    }
});