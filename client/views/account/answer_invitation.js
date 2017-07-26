Template.answerInvitation.rendered = function() {
		var userDraft = getUserDraftMethod(Router.current().params);
		var kwestia = getKwestia(Router.current().params);
		var licznik = userDraft.licznikKlikniec + 1;
		if (kwestia.isAnswerPositive != null) {
			Meteor.call("updateLicznikKlikniec", userDraft._id, licznik, function(error) {
				if (error) throwError(error.reason);
			});
		}
	},

Template.answerInvitation.helpers({
	userNotAnswered: function() {
		var currentRoute = Router.current().params;
		var kwestia = getKwestia(currentRoute);
		if (kwestia) {
			return kwestia.isAnswerPositive == null ? true : false;
		}
	},

	timeExpired: function() {
		var kwestia = getKwestia(Router.current().params);
		var param = Parametr.findOne().czasWyczekiwaniaKwestiiSpecjalnej;
		return (moment(kwestia.dataRozpoczeciaOczekiwania).add("days", param).format() < moment(new Date()).format()) ? true : false;
	},

	fullName: function() {
		var userDraft = getUserDraftMethod(Router.current().params);
		return userDraft.profile.firstName + " " + userDraft.profile.lastName;
	},

	organizationName: function() {
		return Parametr.findOne().nazwaOrganizacji ? Parametr.findOne().nazwaOrganizacji : null;
	},

	answeredNow: function() {
		var kwestia = getKwestia(Router.current().params);
		var userDraft = getUserDraftMethod(Router.current().params);
		return (kwestia.isAnswerPositive == true || kwestia.isAnswerPositive == false) && userDraft.licznikKlikniec <= 1 ? true : false;
	},

	ansPos: function() {
		var kwestia = getKwestia(Router.current().params);
		return kwestia.isAnswerPositive == true ? true : false;
	},

	answerPositive: function() {
		var kwestia = getKwestia(Router.current().params);
		var userDraft = getUserDraftMethod(Router.current().params);
		return kwestia.isAnswerPositive == true && userDraft.licznikKlikniec > 1 ? true : false;
	},
	
	answerNegative: function() {
		var kwestia = getKwestia(Router.current().params);
		var userDraft = getUserDraftMethod(Router.current().params);
		return kwestia.isAnswerPositive == false && userDraft.licznikKlikniec > 1 ? true : false;
	},
	
	url: function() {
		var userDraft = getUserDraftMethod(Router.current().params);
		return ("/issueInfo/")
	},
	
	actualKwestia: function() {
		return getKwestia(Router.current().params);
	},
	
	isGuest: function() {
		var userDraft = getUserDraftMethod(Router.current().params);
		return userDraft.profile.idUser == null ? true : false;
	}
});

Template.answerInvitation.events({
	'click #apply': function(e) {
		e.preventDefault();
		// The issue goes to implementation
		var kwestia = getKwestia(Router.current().params);
	},
	'click #refuse': function(e) {
		e.preventDefault();
		var kwestia = getKwestia(Router.current().params);
		var userDraft = getUserDraftMethod(Router.current().params);
		Meteor.call('removeIssueSetReasonAnswer', kwestia._id, false, function(error) {
			if (!error) {
				if (kwestia.idZespolRealizacyjny) {
					var zrDraft = ImplemTeamDraft.findOne({
						_id: kwestia.idZespolRealizacyjny
					});
					Meteor.call("removeImplemTeamDraft", kwestia.idZespolRealizacyjny, function(error) {
						if (!error) {
							rewriteZRMembersToListMethod(zrDraft, kwestia);
							var licznik = userDraft.licznikKlikniec + 1;
							Meteor.call("removeUserDraftNotZrealizowanyLicznik", userDraft._id, licznik, function(error) {
								if (error) throwError(error.reason);
							});
						}
					});
				}
			} else throwError(error.reason);
		});
	}
});

getKwestia = function(currentRoute) {
	var userDraft = UsersDraft.findOne({
		linkAktywacyjny: currentRoute.linkAktywacyjny
	});
	var kwestia = Kwestia.findOne({
		idUser: userDraft._id
	});
	return kwestia ? kwestia : null;
};

getUserDraftMethod = function(currentRoute) {
	var userDraft = UsersDraft.findOne({
		linkAktywacyjny: currentRoute.linkAktywacyjny
	});
	return userDraft ? userDraft : null;
};

applyPositiveMethod = function(kwestia) {
	var nrUchw = kwestia.issueNumber;
	kwestia.dataRealizacji = new Date();
	kwestia.numerUchwaly = kwestia.issueNumber;
	var idZr = kwestia.idZespolRealizacyjny;
	var zrDraft = ImplemTeamDraft.findOne({
		_id: kwestia.idZespolRealizacyjny
	});
	if (zrDraft.idZR != null) {
		// If draft has id ZR (copy from existing ZR), then add to the ZR list of this draft
		var ZR = ZespolRealizacyjny.findOne({
			_id: zrDraft.idZR
		});
		if (ZR) {
			updateListKwestieMethod(ZR, kwestia._id);
		} else {
			createNewZRMethod(zrDraft, kwestia);
		}
	} else {
		createNewZRMethod(zrDraft, kwestia);
	}
	Meteor.call('removeImplemTeamDraft', kwestia.idZespolRealizacyjny, function(error) {
		if (!error) {
			var userDraft = getUserDraftMethod(Router.current().params);
			var counter = userDraft.licznikKlikniec + 1;
			Meteor.call("updateLicznikKlikniec", userDraft._id, counter, function(error) {
				if (!error) Meteor.call("setAnswerWaitIssueNrResolDateOfImpl", kwestia._id, true, nrUchw, new Date(), function(error) {
					if (error) throwError(error.reason);
				});
			});
		}
	});
};

addNewUser = function(firstName, lastName, city, email, kwestia) {
	applyPositiveMethod(kwestia);
	Meteor.call("serverGenerateLogin", firstName, lastName, function(err, ret) {
		if (!err) {
			var newUser = [{
				email: email,
				login: "",
				firstName: firstName,
				lastName: lastName,
				city: city,
				userType: USERTYPE.HONOROWY
			}];
			newUser[0].login = ret;
			newUser[0].fullName = firstName + " " + lastName;
			newUser[0].password = CryptoJS.MD5(newUser[0].login).toString();
			newUser[0].confirm_password = newUser[0].password;
			Meteor.call('addUser', newUser, function(error, ret) {
				if (error) {
					throwError(error.reason);
				} else {
					var idUser = ret;
					Meteor.call("removeUserDraftAddNewIdUser", getUserDraftMethod(Router.current().params)._id, idUser, function(error) {
						if (error) throwError(error.reason);
						else {
							Meteor.call("sendFirstLoginData", idUser, newUser[0].password, function(error) {
								if (error) {
									bootbox.alert(TAPi18n.__('txv.ALERT_LOG1') + TAPi18n.__('txv.ALERT_LOG2') + TAPi18n.__('txv.ALERT_LOG3'));
									var emailError = {
										idUserDraft: userDraft._id,
										type: NOTIFICATION_TYPE.FIRST_LOGIN_DATA
									};
									Meteor.call("addEmailError", emailError);
								}
							})
						}
					});
				}
			});
		} else {
			throwError(err.reason)
		}
	});
};