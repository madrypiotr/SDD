/*
``client\views\account\`` reset_password.js.js
## Rendering and events for the template reset_password.html */


Template.resetPassword.rendered = function () {
    $('#resetPassword').validate({
        rules: {
            password: {
                minlength: 6
            },
            confirmPassword: {
                equalTo: '#password'
            }
        },
        messages: {
            password: {
                required: fieldEmptyMessage,
                minlength: () => minLengthMessage(6)
            },
            confirmPassword: {
                equalTo: equalToMessage
            }
        },
        highlight: highlightFunction,
        unhighlight: unhighlightFunction,
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            validationPlacementError(error, element);
        }
    });
};

Template.resetPassword.events({
    'submit form': function (e) {
        e.preventDefault();
        var token = this.toString();
        var newPassword = $(e.target).find('[name=password]').val();
        var user = Users.findOne({});

        if (user) {
            if (user.services.password.reset.when.addHours(3) > new Date()) {
                console.log('true');
                Accounts.resetPassword(token, newPassword);
            } else {
                throwError(TAPi18n.__('txv.TOKEN_HAS_EXPIRED'));
            }
        } else {
            throwError(TAPi18n.__('txv.TOKEN_HAS_EXPIRED'));
        }
    }
});
