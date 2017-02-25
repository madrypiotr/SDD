//validation Messages
fieldEmptyMessage = function () {
    return 'Pole jest wymagane';
};
positiveNumberMessage = function () {
    return 'Podaj wartość większą od zera';
};
negativeNumberMessage = function () {
    return 'Nie można wprowadzać ujemnych wartości';
};
decimalNumberMessage = function () {
    return 'Podana wartość nie jest liczbą';
};
minLengthMessage = function (length) {
    return 'Pole musi mieć minimum ' + length + ' znaków';
};
maxLengthMessage = function (length) {
    return 'Pole musi mieć maksimum ' + length + ' znaków';
};
properLengthMessage = function (length) {
    return 'Pole musi mieć ' + length + ' znaków';
};
validEmailMessage = function () {
    return 'Wprowadż poprawny adres email';
};
equalToMessage = function () {
    return 'Wprowadź tę samą wartość ponownie';
};
//validation- highlight field
highlightFunction = function (element) {
    var id_attr = "#" + $(element).attr("id") + "1";
    $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    $(id_attr).removeClass('glyphicon-ok').addClass('glyphicon-remove');
};
//validation- unhighlight field
unhighlightFunction = function (element) {
    var id_attr = "#" + $(element).attr("id") + "1";
    $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    $(id_attr).removeClass('glyphicon-remove').addClass('glyphicon-ok');
};
//validation - error
validationPlacementError = function (error, element) {
    if (element.length) {
        error.insertAfter(element);
    } else {
        error.insertAfter(element);
    }
};

jQuery.validator.addMethod("checkExistsNazwaKwestii", function (value, element) {
    var kwestie = Kwestia.find({czyAktywny: true});
    var found = null;
    kwestie.forEach(function (item) {
        if (_.isEqual(item.kwestiaNazwa.toLowerCase().trim(), value.toLowerCase().trim())) {
            found = true;
        }
    });
    return this.optional(element) || found == null;
}, 'Ta Kwestia już istnieje!');

jQuery.validator.addMethod("checkExistsNazwaZespoluRealizacyjnego", function (value, element) {
    var zespoly = ZespolRealizacyjny.find({});
    var found = null;
    zespoly.forEach(function (item) {
        if (_.isEqual(item.nazwa.toLowerCase().trim(), value.toLowerCase().trim())) {
            found = true;
        }
    });
    return this.optional(element) || found == null;
}, 'Zespół Realizacyjny o tej nazwie już istnieje!');

jQuery.validator.addMethod("checkExistsAnyEmail", function (value, element) {
    var found = null;
        found=checkExistsUser(value,null,null);
    return this.optional(element) || found == null;
}, 'Istnieje już w systemie użytkownik o podanym adresie email!');

jQuery.validator.addMethod("checkExistsEmailZwyczajny", function (value, element) {
    var found=null;
    var users=Users.find({'profile.userType':{$in:[USERTYPE.CZLONEK,USERTYPE.HONOROWY]}});
    users.forEach(function(user){
       if(user.emails[0].address==value)
        found=true;
    });
    return this.optional(element) || found== null;
}, 'Istnieje już w systemie użytkownik o podanym adresie email!');

jQuery.validator.addMethod("checkExistsEmail", function (value, element,param) {
    var found = null;
    if (!Meteor.userId()) {
        found=checkExistsUser(value,param,null);
    }
    return this.optional(element) || found == null;
}, 'Istnieje już w systemie podany użytkownik z pozycją, na którą aplikujesz!');

jQuery.validator.addMethod("checkExistsEmail2", function (value, element,param) {
    var found = null;
    if (!Meteor.userId()) {
        found=checkExistsUser(value,param,USERTYPE.HONOROWY);
    }
    return this.optional(element) || found == null;
}, 'Istnieje już w systemie podany użytkownik. Any wykonać operację zmiany stanowiska, musisz być zalogowany!');


jQuery.validator.addMethod("checkExistsEmailDraft", function (value, element) {
    var usersDraft = UsersDraft.find({
        $where: function () {
            return (((this.email == value) || (this.email.toLowerCase() == value.toLowerCase()))&& this.czyAktywny==true);
        }
    });
    var found = null;
    if (usersDraft.count() > 0) {
        found = true;
    }
    return this.optional(element) || found == null;
}, 'Został już złożony wniosek na podany adres email!');

jQuery.validator.addMethod("exactlength", function(value, element,param) {
    return this.optional(element) || value.length == param;
}, "Wprowadź dokładnie {0} znaków.");

jQuery.validator.addMethod("peselValidation", function(value, element) {
    var filter =/^[0-9]{11}$/;
    return this.optional(element) || filter.test(value);
}, "Niepoprawny format Numeru PESEL.");

jQuery.validator.addMethod("peselValidation2", function(value, element) {
    var found=null;
    var wagi = [9,7,3,1,9,7,3,1,9,7];
    var suma = 0;
    for(var i=0;i < wagi.length; i++)
    {
        suma+=(parseInt(value.substring(i,i+1),10)*wagi[i]);
    }
    suma=suma % 10;
    var cyfraKontr = parseInt(value.substring(10,11),10);
    if(suma==cyfraKontr)
        found=false;
    else found ==null;
    return this.optional(element) || found == false;
}, "Nieprawidłowy Numer PESEL");

jQuery.validator.addMethod("kodPocztowyValidation", function(value, element) {
    var filter =/^[0-9]{2}-[0-9]{3}$/;
    return this.optional(element) || filter.test(value);
}, "Niepoprawny format.");

jQuery.validator.addMethod("isNotEmptyValue", function(value, element) {
    return value==0 || value=="" ? false : true;
}, "Pole jest wymagane");

//NOT USED!
trimInput = function (value) {
    return value.replace(/^\s*|\s*$/g, '');
};
/*

 @value- value to check either is empty or not
 @statement- name of field,that will be displayed in messsage,if field is empty
 @fieldName- name of field, that has to be highlighted or not depending of value content
 */
isNotEmpty = function (value, statement, fieldName) {
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
    throwError('Uzupełnij pole ' + statement);
    return false;
};


isEmail = function (value) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(value)) {
        return true;
    }
    throwError('Proszę wpisać prawidłowy adres e-mail.');
    return false;
};

isValidPassword = function (password) {
    if (password.length < 6) {
        throwError('Hasło powinno składać się przynajmniej z 6 znaków.');
        return false;
    }
    return true;
};

areValidPasswords = function (password, confirm) {
    if (!isValidPassword(password)) {
        return false;
    }
    if (password !== confirm) {
        throwError('Hasła do siebie nie pasują.');
        return false;
    }
    return true;
};

isPositiveNumber = function (value, statement) {
    if (value > 0) {
        return true;
    }
    throwError('Nie można podawać ujemnych wartości w polu ' + statement);
    return false;
};

isNumeric = function (value, statement) {
    var filter = /^\d+([.]\d+)?$/;
    if (filter.test(value)) {
        return true;
    }
    throwError('Proszę wpisać prawidłowy format liczby w polu ' + statement);
    return false;
};