Template.glosowanie.helpers({
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'dataGlosowania', label: TAPi18n.__('txv.DATE_OF_VOTE'), tmpl: Template.dataGlosowaniaKwestia ,sortOrder:0,sortDirection:'ascending'},
                { key: 'kwestiaNazwa', label: TAPi18n.__('informacjeKwestiaArchiwum.ikaNameIssue'), tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TAPi18n.__('informacjeKwestiaArchiwum.ikaPriority'), tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'idTemat', label: TAPi18n.__('glob.globSubject'), tmpl: Template.tematKwestia},
                { key: 'idRodzaj', label: TAPi18n.__('glob.globType'), tmpl: Template.rodzajKwestia}
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
