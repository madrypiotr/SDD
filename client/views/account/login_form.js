Template.loginForm.rendered = function () {
    $("#loginForm").validate({
        rules: {
            login:{
                required: true
            },
            password: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            login: {
                required: fieldEmptyMessage()
            },
            password: {
                required: fieldEmptyMessage(),
                minlength: minLengthMessage(6)
            }
        },
        highlight: function (element) {
            highlightFunction(element);
        },
        unhighlight: function (element) {
            unhighlightFunction(element);
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            validationPlacementError(error, element);
        }
    })
};

Template.loginForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var user = {
            login: $(e.target).find('[name=login]').val(),
            password: $(e.target).find('[name=password]').val()
        };

        if (isNotEmpty(user.login, 'login') && isNotEmpty(user.password, 'hasło') && isValidPassword(user.password)) {
            Meteor.loginWithPassword(user.login, user.password, function (err) {
                if (err) {
                    throwError(TXV.INCOR_LOGIN_DET);
                } else {
                    if (Meteor.loggingIn()) {

                        Router.go('home');
                    }
                    Meteor.logoutOtherClients();
                }
            });
        } else {
            return false;
        }
    },
    'click #forgottenPassword': function (e) {
        Router.go('forgotten_password');
    }
});