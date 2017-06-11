Template.kosz.helpers({
    'settings': function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                { key: 'kwestiaNazwa', label: TAPi18n.__('informacjeKwestiaArchiwum.ikaNameIssue'), tmpl: Template.nazwaKwestiLink },
                { key: 'wartoscPriorytetu', label: TAPi18n.__('informacjeKwestiaArchiwum.ikaPriority'), tmpl: Template.priorytetKwestia ,sortOrder:1,sortDirection:'descending'},
                { key: 'idTemat', label: TAPi18n.__('glob.globSubject'), tmpl: Template.tematKwestia },
                { key: 'idRodzaj', label: TAPi18n.__('glob.globType'), tmpl: Template.rodzajKwestia }
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
