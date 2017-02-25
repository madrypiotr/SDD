Template.listTemat.created = function () {
    this.idTematRV = new ReactiveVar;
};

Template.listTemat.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
    var self = Template.instance();
    self.idTematRV.set(null);
};

Template.listTemat.events({
    'click .glyphicon-trash': function (event, template) {
        Session.set('tematInScope', this);
    },
    'click .glyphicon-pencil': function (event, template) {
        Session.set('tematInScope', this);
    },
    'click #reload': function (e) {
        var id = $(e.target).attr("name");
        var self = Template.instance();
        self.idTematRV.set(id);
    },
    'click #reloadAll': function () {
        var self = Template.instance();
        self.idTematRV.set(null);
    }
});
Template.listTemat.helpers({
    'settingsTemat': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            fields: [
                {key: 'nazwaTemat', label: "Nazwa tematu", headerClass: "col-md-2"},
                {key: 'opis', label: "Opis", headerClass: "col-md-7"},
                {key: '_id', label: "Opcje", tmpl: Template.optionsColumnTemat, headerClass: "col-md-3"}
            ],
            filters: ['nazwaTemat']
        };
    },
    'settingsRodzaj': function () {
        return {
            rowsPerPage: 10,
            //showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false,
            enableRegex: false,
            showRowCount: true,
            fields: [
                {key: 'nazwaRodzaj', label: "Nazwa rodzaju", tmpl: Template.nazwaRodzajuLink, headerClass: "col-md-2"},
                {key: 'idTemat', label: "Temat", tmpl: Template.tematRodzaj, headerClass: "col-md-5"},
                {key: 'kworum', label: "Kwestia"},
                {key: '_id', label: "Opcje", tmpl: Template.optionsColumnRodzaj, headerClass: "col-md-3"}
            ]
        };
    },
    listRodzaj: function () {
        var self = Template.instance();
        var id = self.idTematRV.get();
        return id == null ? Rodzaj.find({}).fetch() : Rodzaj.find({idTemat: id}).fetch();
    },
    listTemat: function () {
        return Temat.find({}).fetch();
    },
    rodzajCount: function () {
        var self = Template.instance();
        var id = self.idTematRV.get();
        return !!id ? Rodzaj.find({idTemat: id}).count() : Rodzaj.find({}).count();
    },
    tematCount: function () {
        return Temat.find().count();
    },
    isAdminUser: function () {
        return IsAdminUser();
    },
    getTemat: function () {
        var self = Template.instance();
        var id = self.idTematRV.get();
        return !!id ? Temat.findOne({_id: id}).nazwaTemat : "wszystkie";
    }
});

Template.optionsColumnTemat.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
};

Template.optionsColumnRodzaj.rendered = function () {
    $('[data-toggle="tooltip"]').tooltip();
};