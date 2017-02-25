// TO DO czy potrzebne? Do usunięcia!!! widok też bo lista rodzajow jest w kategoryzacji
Template.listRodzaj.rendered = function () {
};

Template.listRodzaj.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('rodzajInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('rodzajInScope', this);
    }
});
Template.listRodzaj.helpers({
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwaRodzaj', label: "Nazwa rodzaju", tmpl: Template.nazwaRodzajuLink},
                {key: 'idTemat', label: "Temat", tmpl: Template.tematRodzaj},
                {key: 'options', label: "Opcje", tmpl: Template.editColumnRodzaj}
            ]
        };
    },
    RodzajList: function () {
        return Rodzaj.find({}).fetch();
    },
    rodzajCount: function () {
        return Rodzaj.find().count();
    },
    isAdminUser: function () {
        return IsAdminUser();
    },
    tematNazwa: function () {
        return Temat.findOne({_id: this.idTemat});
    }
});

Template.tematRodzaj.helpers({
    tematNazwa: function () {
        var t = Temat.findOne({_id: this.idTemat});
        if (t) return t.nazwaTemat;
    }
})