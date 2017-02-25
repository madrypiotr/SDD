/**
 * Created by Bartłomiej Szewczyk on 2015-12-07.
 */
Template.forgottenPassword.rendered = function () {
    document.getElementById("resetButton").disabled=false;
    $("#forgottenPassword").validate({
        rules: {
            email: {
                email: true,
            }
        },
        messages: {
            email: {
                required: fieldEmptyMessage(),
                email: validEmailMessage()
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
            if(element.attr("name") == "statutConfirmation")
                error.insertAfter(document.getElementById("statutConfirmationSpan"));
            else
                validationPlacementError(error, element);
        }
    });
};
Template.forgottenPassword.events({
    'submit form': function (e) {
        e.preventDefault();

        var options = {
            email: $(e.target).find('[name=email]').val()
        };

        if (isNotEmpty(options.email, 'email') && isEmail(options.email)) {
            Meteor.call('serverCheckExistsUser', options.email, null, null, function (error, ret) {
                if (error) {
                    throwError(error.reason);
                }
                else {
                    if(ret == true){
                        //Accounts.forgotPassword(options);
                        document.getElementById("resetButton").disabled=true;
                        Meteor.call('sendResetPasswordEmail', options.email, function (error, ret) {
                            if (error) {
                                document.getElementById("resetButton").disabled=false;
                                throwError(TXV.ALERT_LOG4);
                                var emailError = {
                                    email: options.email,
                                    type: NOTIFICATION_TYPE.RESET_PASSWORD
                                };
                                Meteor.call("addEmailError", emailError);
                            }
                            else {
                                GlobalNotification.success({
                                    title: TXV.SUCCESS,
                                    content: TXV.LINK_CHAN_PASS,
                                    duration: 5 // duration the notification should stay in seconds
                                });
                                Router.go('login_form');
                                return true;
                            }
                        });
                    }else{
                        document.getElementById("resetButton").disabled=false;
                        throwError(TXV.EM_DOES_NOT);
                        return false;
                    }
                }
            });
        } else {
            return false;
        }
    }
});