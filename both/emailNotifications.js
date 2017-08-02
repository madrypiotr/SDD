//## E-mail notifications of system events, which will be sent to all users who have the right to view the Issue.
EmailNotifications = function () {
	//Message after adding a Issue
	this.registerAddKwestiaNotification = function ( nazwaSystem, organizacja, users, nazwaKwestii, rodzaj, szczegolyKwestii, linkDK, linkLoginTo ) {
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
		Meteor.call ( "registerAddKwestiaNotification", prop );
	};
	//Communication after the vote begins
	this.registerStartGlosowanieNotification = function ( nazwaSystem, organizacja, user, nazwaKwestii, temat, rodzaj, szczegolyKwestii, final, priorytet, linkDK, silaPrior, kworum, obecnych, linkLoginTo ) {
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
		Meteor.call ( "registerStartGlosowanieNotification", prop );
	};
	//Communication on the adoption of the resolution
	this.podjecieUchwalyNotification = function ( nazwaSystem, organizacja, user, status, nazwaKwestii, temat, rodzaj, szczegolyKwestii, pdfUchwala, linkDR, linkLoginTo ) {
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
		Meteor.call ( "podjecieUchwalyNotification", prop );
	};
	//Lobbying for the Issue
	this.registerLobKwestiaNotification = function ( nazwaSystem, organizacja, user, kwestiaNazwa, temat, rodzaj, szczegolyKwestii, uzasadnienie, mojeImie, mojeNazwisko, mojEmail, linkMojProfil ) {
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
		Meteor.call ( "registerLobKwestiaNotification", prop );
	};
}