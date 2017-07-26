//## validation Messages

fieldEmptyMessage = function() {
	return TAPi18n.__('txv.THIS_FIELD_IS_REQUIRED');
};

positiveNumberMessage = function() {
	return TAPi18n.__('txv.ENTER_A_VALUE_GREATER_THAN_ZERO');
};

negativeNumberMessage = function() {
	return TAPi18n.__('txv.YOU_CAN_NOT_ENTER_NEGATIVE_VALUES');
};

decimalNumberMessage = function() {
	return TAPi18n.__('txv.THE_SPECIFIED_VALUE_IS_NOT_A_NUMBER');
};

minLengthMessage = function(length) {
	return TAPi18n.__('txv.THE_FIELD_MUST_HAVE_A_MINIMUM') + length + TAPi18n.__('txv.CHARACTERS');
};

maxLengthMessage = function(length) {
	return TAPi18n.__('txv.THE_FIELD_MUST_HAVE_A_MAX') + length + TAPi18n.__('txv.CHARACTERS');
};

properLengthMessage = function(length) {
	return TAPi18n.__('txv.THE_FIELD_MUST_HAVE_A') + length + TAPi18n.__('txv.CHARACTERS');
};

validEmailMessage = function() {
	return TAPi18n.__('txv.ENTER_THE_CORRECT_EMAIL_ADDRESS');
};

equalToMessage = function() {
	return TAPi18n.__('txv.ENTER_THE_SAME_VALUE_AGAIN');
};

//validation- highlight field
highlightFunction = function(element) {
	var id_attr = "#" + $(element).attr("id") + "1";
	$(element).closest('.form-group').removeClass('has-success').addClass('has-error');
	$(id_attr).removeClass('glyphicon-ok').addClass('glyphicon-remove');
};

//validation- unhighlight field
unhighlightFunction = function(element) {
	var id_attr = "#" + $(element).attr("id") + "1";
	$(element).closest('.form-group').removeClass('has-error').addClass('has-success');
	$(id_attr).removeClass('glyphicon-remove').addClass('glyphicon-ok');
};

//validation - error
validationPlacementError = function(error, element) {
	if (element.length) {
		error.insertAfter(element);
	} else {
		error.insertAfter(element);
	}
};

jQuery.validator.addMethod("checkExistsNazwaKwestii", function(value, element) {
	var kwestie = Kwestia.find({
		czyAktywny: true
	});
	var found = null;
	kwestie.forEach(function(item) {
		if (_.isEqual(item.kwestiaNazwa.toLowerCase().trim(), value.toLowerCase().trim())) {
			found = true;
		}
	});
	return this.optional(element) || found == null;
}, TAPi18n.__('txv.THIS_ISSUE_ALREADY_EXISTS'));

jQuery.validator.addMethod("checkExistsNazwaZespoluRealizacyjnego", function(value, element) {
	var zespoly = ZespolRealizacyjny.find({});
	var found = null;
	zespoly.forEach(function(item) {
		if (_.isEqual(item.nazwa.toLowerCase().trim(), value.toLowerCase().trim())) {
			found = true;
		}
	});
	return this.optional(element) || found == null;
}, TAPi18n.__('txv.THE_IMPL_TEAM_OF_THE_SAME_NAME_ALREADY_EXISTS'));

jQuery.validator.addMethod("checkExistsAnyEmail", function(value, element) {
	var found = null;
	found = checkExistsUser(value, null, null);
	return this.optional(element) || found == null;
}, TAPi18n.__('txv.THERE_ARE_ALREADY_IN_THE_SYSTEM_YOU_ADDRESS_AN_EMAIL'));

jQuery.validator.addMethod("checkExistsEmailZwyczajny", function(value, element) {
	var found = null;
	var users = Users.find({
		'profile.userType': {
			$in: [USERTYPE.CZLONEK]
		}
	});
	users.forEach(function(user) {
		if (user.emails[0].address == value) found = true;
	});
	return this.optional(element) || found == null;
}, TAPi18n.__('txv.THERE_IS_ALREADY_A_SYSTEM_USER_WITH_THE_GIVEN_EMAIL_ADDRESS'));

jQuery.validator.addMethod("checkExistsEmail", function(value, element, param) {
	var found = null;
	if (!Meteor.userId()) {
		found = checkExistsUser(value, param, null);
	}
	return this.optional(element) || found == null;
}, TAPi18n.__('txv.THERE_ARE_ALREADY_IN_THE_SYSTEM_PROVIDED_THE_USER_FOR_WHICH_YOURE_TRYING'));

jQuery.validator.addMethod("checkExistsEmail2", function(value, element, param) {
	var found = null;
	return this.optional(element) || found == null;
}, TAPi18n.__('txv.LONGER_EXISTS_ON_THE_SPECIFIED_USER'));

jQuery.validator.addMethod("checkExistsEmailDraft", function(value, element) {
	var usersDraft = UsersDraft.find({
		$where: function() {
			return (((this.email == value) || (this.email.toLowerCase() == value.toLowerCase())) && this.czyAktywny == true);
		}
	});
	var found = null;
	if (usersDraft.count() > 0) {
		found = true;
	}
	return this.optional(element) || found == null;
}, TAPi18n.__('txv.IT_HAS_ALREADY_SUBMITTED_A_REQUEST_TO_THE_SPECIFIED_EMAIL'));

jQuery.validator.addMethod("exactlength", function(value, element, param) {
	return this.optional(element) || value.length == param;
}, TAPi18n.__('txv.ENTER_EXACTLY') + TAPi18n.__('txv.CHARACTERS'));

jQuery.validator.addMethod("peselValidation", function(value, element) {
	var filter = /^[0-9]{11}$/;
	return this.optional(element) || filter.test(value);
}, TAPi18n.__('txv.WRONG_FORMAT_PID'));

jQuery.validator.addMethod("peselValidation2", function(value, element) {
	var found = null;
	var wagi = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7];
	var suma = 0;
	for (var i = 0; i < wagi.length; i++) {
		suma += (parseInt(value.substring(i, i + 1), 10) * wagi[i]);
	}
	suma = suma % 10;
	var cyfraKontr = parseInt(value.substring(10, 11), 10);
	if (suma == cyfraKontr) found = false;
	else found == null;
	return this.optional(element) || found == false;
}, TAPi18n.__('txv.WRONG_NUMBER_PID'));

jQuery.validator.addMethod("kodPocztowyValidation", function(value, element) {
	var filter = /^[0-9]{2}-[0-9]{3}$/;
	return this.optional(element) || filter.test(value);
}, TAPi18n.__('txv.WRONG_FORMAT'));

jQuery.validator.addMethod("isNotEmptyValue", function(value, element) {
	return value == 0 || value == "" ? false : true;
}, TAPi18n.__('txv.THE_FIELD_IS_REQUIRED'));

//NOT USED!
trimInput = function(value) {
	return value.replace(/^\s*|\s*$/g, '');
};

/*
 @value- value to check either is empty or not
 @statement- name of field,that will be displayed in messsage,if field is empty
 @fieldName- name of field, that has to be highlighted or not depending of value content
 */
 
isNotEmpty = function(value, statement, fieldName) {
	value = value.replace(/\s+/g, '');
	if (value !== '' && value !== '0') {
		if (fieldName != null) {
			document.getElementById(fieldName).classList.remove('has-error');
		}
		return true;
	}
	if (fieldName != null) {
		document.getElementById(fieldName).classList.add('has-error');
	}
	throwError(TAPi18n.__('txv.FILL_IN_THE_FIELD') + statement);
	return false;
};

isEmail = function(value) {
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (filter.test(value)) {
		return true;
	}
	throwError(TAPi18n.__('txv.PLEASE_ENTER_A_VALID_EMAIL_ADDRESS'));
	return false;
};

isValidPassword = function(password) {
	if (password.length < 6) {
		throwError(TAPi18n.__('txv.PASSWORD_SHOULD_BE_AT_LEAST_6_CHAR'));
		return false;
	}
	return true;
};

areValidPasswords = function(password, confirm) {
	if (!isValidPassword(password)) {
		return false;
	}
	if (password !== confirm) {
		throwError(TAPi18n.__('txv.PASSWORD_DO_NOT_MATCH'));
		return false;
	}
	return true;
};

isPositiveNumber = function(value, statement) {
	if (value > 0) {
		return true;
	}
	throwError(TAPi18n.__('txv.YOU_CAN_NOT_GIVE_NEGATIVE_VALUES_IN_A_FIELD') + statement);
	return false;
};

isNumeric = function(value, statement) {
	var filter = /^\d+([.]\d+)?$/;
	if (filter.test(value)) {
		return true;
	}
	throwError(TAPi18n.__('txv.PLEASE_ENTER_THE_CORRECT_NUMBER_FORMAT_IN_FIELD') + statement);
	return false;
};