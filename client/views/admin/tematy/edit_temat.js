Template.editTematForm.rendered = function () {
    $("#tematForm").validate({
        messages: {
            nazwaTemat: {
                required: fieldEmptyMessage()
            },
            opis: {
                required: fieldEmptyMessage()
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
            if (element.length) {
                error.insertAfter(element);
            } else {
                error.insertAfter(element);
            }
        }
    })
};

Template.editTematForm.events({
    'submit form': function (e) {
        e.preventDefault();
        var idTemat = this._id;

        var temat = {
            nazwaTemat: $(e.target).find('[name=nazwaTemat]').val(),
            opis: $(e.target).find('[name=opis]').val()
        };

        Meteor.call('updateTemat', idTemat, temat, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error('Error: ' + error.reason);
                else
                    throwError(error.reason);
            }
            else Router.go('listTemat');
        });
    },
    'reset form': function () {
        Router.go('listTemat');
    }
})