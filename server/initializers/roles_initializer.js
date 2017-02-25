Meteor.startup(function () {
    Subroles.remove({});
    var permissions = [
        //uzytkownicy 10
        {name: "manage-my-account", description: "Zarządzanie swoim profilem"},
        {name: "edit-my-profile", description: "Edycja mojego profilu"},
        {name: "manage-all-profiles", description: "Zarządzanie wszystkimi profilami użytkowników"},
        {name: "see-user-profile-info", description: "Możliwość przeglądania szczegółów profili użytkowników"},
        {name: "manage-all-users", description: "Zarządzanie użytkownikami"},
        {name: "edit-user-profile", description: "Możliwość edycji profilu użytkownika"},
        {name: "manage-roles", description: "Zarządzanie rolami"},
        {name: "manage-subroles", description: "Zarządzanie uprawnieniami"},
        {name: "add-role-permission", description: "Możliwość dodania roli"},
        {name: "add-subrole-permission", description: "Możliwość dodania uprawnienia"},

        //rodzaje 3
        {name: "manage-all-rodzaje", description: "Zarządzanie rodzajami"},
        {name: "add-rodzaj", description: "Możliwość dodania rodzaju"},
        {name: "edit-rodzaj", description: "Możliwość edycji rodzaju"},

        //tematy 3
        {name: "manage-all-tematy", description: "Zarządzanie tematami"},
        {name: "add-temat", description: "Możliwość dodania tematu"},
        {name: "edit-temat", description: "Możliwość edycji tematu"},

        //kwestie 17
        {name: "manage-kwestia-list", description: "Zarządzanie Wykazem Kwestii"},
        {name: "can-vote-kwestia", description: "Możliwość nadawania priorytetu Kwestii"},
        {name: "can-vote-post", description: "Możliwość głosowania na posty w dyskusjii Kwestii"},
        {name: "manage-realizacja", description: "Zarządzanie modułem Realizacja"},
        {name: "manage-archiwum-list", description: "Zarządzanie Archiwum"},
        {name: "manage-moje-kwestie", description: "Zarządzanie moimi Kwestiami"},
        {name: "manage-kwestie-oczekujace", description: "Zarządzanie Kwestiami oczekującymi na kategoryzację"},
        {name: "kategoryzacja-kwestii-oczekujacej", description: "Możliwość kategoryzacji Kwestii"},
        {name: "manage-kwestia-info", description: "Możliwość podglądu informacji o Kwestii"},
        {name: "can-add-option", description: "Możliwość dodania Opcji Kwestii"},
        {name: "can-add-priorytet-kwestia", description: "Możliwość nadania priorytetu Kwestii"},
        {name: "can-add-priorytet-post", description: "Możliwość nadania priorytetu postu"},
        {name: "can-add-post-archiwum", description: "Możliwość wybrania Przenieś Do Archiwum"},
        {name: "can-add-post-kosz", description: "Możliwość wybrania Przenieś Do Kosza"},
        {name: "can-clear-priorytety", description: "Możliwość wyczyszczenia priorytetów"},
        {name: "can-add-post", description: "Możliwość dodania posta - dyskusja"},
        {name: "can-add-answer", description: "Możliwość dodania odpowiedzi do posta - dyskusja"},

        //parametry 4
        {name: "manage-all-parametry", description: "Zarządzanie parametrami"},
        {name: "add-parametr", description: "Możliwość dodania parametru"},
        {name: "edit-parametr", description: "Możliwość edycji parametru"},
        {name: "preview-parametr", description: "Możliwość podglądu parametru"},

        //raporty 2
        {name: "manage-all-raporty", description: "Zarządzanie raportami"},
        {name: "add-raport", description: "Możliwość dodania raportu"},

        //języki 3
        {name: "manage-all-languages", description: "Zarządzanie językami"},
        {name: "add-language", description: "Możliwość dodania języka"},
        {name: "edit-language", description: "Możliwość edycji języka"}
    ];

    if (Subroles.find({}).count() == 0) {
        _.each(permissions, function (e) {
            var s = Subroles.insert({name: e.name, description: e.description});
        });
    }
});

var roles = [
    {
        "_id" : "XZNjTtTrHnF4zXsfD",
        "name" : "admin",
        "subRoles" : [
            "manage-my-account",
            "edit-my-profile",
            "manage-all-profiles",
            "see-user-profile-info",
            "manage-all-users",
            "edit-user-profile",
            "manage-roles",
            "manage-subroles",
            "add-role-permission",
            "add-subrole-permission",
            "manage-all-rodzaje",
            "add-rodzaj",
            "edit-rodzaj",
            "manage-all-tematy",
            "add-temat",
            "edit-temat",
            "manage-kwestia-list",
            "can-vote-kwestia",
            "can-vote-post",
            "manage-realizacja",
            "manage-archiwum-list",
            "manage-moje-kwestie",
            "manage-kwestie-oczekujace",
            "kategoryzacja-kwestii-oczekujacej",
            "manage-kwestia-info",
            "can-add-option",
            "can-add-priorytet-kwestia",
            "can-add-priorytet-post",
            "can-add-post-archiwum",
            "can-add-post-kosz",
            "can-clear-priorytety",
            "can-add-post",
            "can-add-answer",
            "manage-all-parametry",
            "add-parametr",
            "edit-parametr",
            "preview-parametr",
            "manage-all-raporty",
            "add-raport",
            "manage-all-languages",
            "add-language",
            "edit-language"
        ]
    }
];

_.each(roles,function(e){
    var r = Meteor.roles.findOne({name: e.name});
    if(!r){
        var i = Meteor.roles.insert(e);
    }
});