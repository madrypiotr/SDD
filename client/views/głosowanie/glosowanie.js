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
                { key: 'kwestiaNazwa', label: TXV.NAME_OF_ISSUES, tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TXV.PRIORITY, tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'idTemat', label: TXV.SUBJECT, tmpl: Template.tematKwestia},
                { key: 'idRodzaj', label: TXV.TYPE, tmpl: Template.rodzajKwestia}
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