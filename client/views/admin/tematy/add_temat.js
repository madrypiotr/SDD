Template.addTematForm.rendered = function () {
    $("#tematForm").validate({
        messages: {
            nazwaTemat: {
                required: fieldEmptyMessage(),
            },
            opis: {
                required: fieldEmptyMessage()
            }
        },
        highlight: function (element) {
            var id_attr = "#" + $(element).attr("id") + "1";
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            $(id_attr).removeClass('glyphicon-ok').addClass('glyphicon-remove');
        },
        unhighlight: function (element) {
            var id_attr = "#" + $(element).attr("id") + "1";
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            $(id_attr).removeClass('glyphicon-remove').addClass('glyphicon-ok');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.length) {
                error.insertAfter(element);
            } else {
                error.insertAfter(element);
            }
        }
    })
};
Template.addTematForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var newTemat = [
            {
                nazwaTemat: $(e.target).find('[name=nazwaTemat]').val(),
                opis: $(e.target).find('[name=opis]').val()
            }];
        Meteor.call('addTemat', newTemat, function (error) {
            if (error) {
                // optionally use a meteor errors package
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else {
                Router.go('listTemat');
            }
        });
    },
    'reset form': function () {
        Router.go('listTemat');
    }
});