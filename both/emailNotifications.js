EmailNotifications = function () {

    //Komunikat po dodaniu Kwestii
    this.registerAddKwestiaNotification = function (nazwaSystem, organizacja, users, nazwaKwestii, rodzaj,
                                                    szczegolyKwestii, linkDK, linkLoginTo) {
        //bedzie wysylane do wszystkich uzytkownikow, ktorzy maja uprawnienie do przegladania kwestii
        var prop = {
            nazwaSystem: nazwaSystem,
            organizacja: organizacja,
            users: users,
            nazwaKwestii: nazwaKwestii,
            rodzaj: rodzaj,
            szczegolyKwestii: szczegolyKwestii,
            linkDK: linkDK,
            linkLoginTo: linkLoginTo
        };
        Meteor.call("registerAddKwestiaNotification", prop);
    };

    //Komunikat po rozpoczęciu głosowania
    this.registerStartGlosowanieNotification = function (nazwaSystem, organizacja, user, nazwaKwestii, temat, rodzaj,
                                                         szczegolyKwestii, final, priorytet, linkDK, silaPrior,
                                                         kworum, obecnych, linkLoginTo) {
        var prop = {
            nazwaSystem: nazwaSystem,
            organizacja: organizacja,
            user: user,
            nazwaKwestii: nazwaKwestii,
            temat: temat,
            rodzaj: rodzaj,
            szczegolyKwestii: szczegolyKwestii,
            final: final,
            priorytet: priorytet,
            linkDK: linkDK,
            silaPrior: silaPrior,
            kworum: kworum,
            obecnych: obecnych,
            linkLoginTo: linkLoginTo
        };
        Meteor.call("registerStartGlosowanieNotification", prop);
    };

    //Komunikat o podjęciu uchwały
    this.podjecieUchwalyNotification = function (nazwaSystem, organizacja, user, status, nazwaKwestii,
                                                 temat, rodzaj, szczegolyKwestii, pdfUchwala, linkDR, linkLoginTo) {
        var prop = {
            nazwaSystem: nazwaSystem,
            organizacja: organizacja,
            user: user,
            status: status,
            nazwaKwestii: nazwaKwestii,
            temat: temat,
            rodzaj: rodzaj,
            szczegolyKwestii: szczegolyKwestii,
            pdfUchwala: pdfUchwala,
            linkDR: linkDR,
            linkLoginTo: linkLoginTo
        };
        Meteor.call("podjecieUchwalyNotification", prop);
    };
    //Lobbowanie Kwestii
    this.registerLobKwestiaNotification = function (nazwaSystem, organizacja, user, kwestiaNazwa, temat, rodzaj,
                                                    szczegolyKwestii, uzasadnienie, mojeImie, mojeNazwisko, mojEmail, linkMojProfil) {
        var prop = {
            nazwaSystem: nazwaSystem,
            organizacja: organizacja,
            user: user,
            kwestiaNazwa: kwestiaNazwa,
            temat: temat,
            rodzaj: rodzaj,
            szczegolyKwestii: szczegolyKwestii,
            uzasadnienie: uzasadnienie,
            mojeImie: mojeImie,
            mojeNazwisko: mojeNazwisko,
            mojEmail: mojEmail,
            linkMojProfil: linkMojProfil
        };
        Meteor.call("registerLobKwestiaNotification", prop);
    };
}