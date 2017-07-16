//## Check the role, email, and existence of the user to confirm the adoption

IsAdminUser = function() {
	return Roles.userIsInRole(Meteor.user(), ['admin']);
};

setRoles = function() {
	var roles = document.getElementById('role');
	if (roles) {
		Roles.getAllRoles().forEach(function(role) {
			var option = document.createElement("option");
			option.text = role.name;
			roles.add(option, null);
		});
	}
};

getEmail = function(_this) {
	if (_this.emails && _this.emails.length) return _this.emails[0].address;
	if (_this.services) {
		// iterate through services
		for (var serviceName in _this.services) {
			var serviceObject = _this.services[serviceName];
			// if an 'id' isset then assume valid service
			if (serviceObject.id) {
				if (serviceObject.email) {
					return serviceObject.email;
				}
			}
		}
	}
	return "";
};

checkExistsUser = function(searchedEmail, userType1, userType2) {
	// used to validate the application on a member, advisor and confiramide in them
	var found = null;
	var userType = null;
	var users = Users.find();
	users.forEach(function(user) {
		_.each(user.emails, function(email) {
			if (_.isEqual(email.address.toLowerCase(), searchedEmail.toLowerCase())) {
				if (userType1 == null && userType2 == null) 
				// to search or to find such a user in the system
					found = true;
				else {
					userType = user.profile.userType;
					if (userType2 == null) {
						if (userType == userType1) { 
						// for the search, whether the advisor / member is in the system
							found = true;
						}
					} else {
						if (userType == userType1 || userType == userType2) { 
						// for search it is at least a member or advisor
							found = true;
						}
					}
				}
			}
		});
	});
	return found;
};

przyjecieWnioskuConfirmation = function(time, email, userTypeText) {
	// confirmation of the processing of the application
	bootbox.dialog({
		message: TAPi18n.__('txv.YOUR_APPLICATION_FORM_WIL_BE_WAITING') + time + TAPi18n.__('txv.DAYS_FOR_APPROVAL_OF_THE_TOTAL_MEMBERS') + getNazwaOrganizacji() + TAPi18n.__('txv.AFTER_A_POSITIVE_EXAMINATION_WILL_RECIVE_INFO') + email + TAPi18n.__('txv.YOU_WILL_RECEIVE_A_LINK_TO_ACTIVATE_YOUR') + userTypeText,
		title: TAPi18n.__('txv.WARNING'),
		buttons: {
			main: {
				label: TAPi18n.__('txv.OK'),
				className: "btn-primary"
			}
		}
	});
};

	// This function is probably not used. Make sure it is potentially useful
getAllUsersWhoVoted = function(idKWestia) {
	var kwestia = Kwestia.findOne({
		_id: idKWestia
	});
	if (kwestia) {
		var tab = kwestia.glosujacy;
		if (tab) {
			var tabNew = [];
			for (var j = 0; j < tab.length; j++) {
				tabNew.push(tab[j].idUser);
			}
			return tabNew;
		}
	}
};
