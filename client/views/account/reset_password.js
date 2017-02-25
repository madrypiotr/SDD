/**
 * Created by Bartłomiej Szewczyk on 2015-12-07.
 */
Template.resetPassword.rendered = function () {

    $("#resetPassword").validate({
        rules: {
            password: {
                minlength: 6
            },
            confirmPassword: {
                equalTo: "#password"
            }
        },
        messages: {
            password: {
                required: fieldEmptyMessage(),
                minlength: minLengthMessage(6)
            },
            confirmPassword: {
                equalTo: equalToMessage()
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
    });
};

Template.resetPassword.events({
    'submit form': function(e){
        e.preventDefault();
        var token = this.toString();
        var newPassword = $(e.target).find('[name=password]').val();
        var user = Users.findOne({});

        if(user){
            if(user.services.password.reset.when.addHours(3) > new Date()){
                console.log("true");
                Accounts.resetPassword(token,newPassword);
            }
            else{
                throwError(TXV.TOKEN_HAS_EXPIRED);
            }
        }else{
            throwError(TXV.TOKEN_HAS_EXPIRED);
        }
    }
});