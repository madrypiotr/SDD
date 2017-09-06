Template.editLanguage.rendered = function () {
    $('#languageEditForm').validate({
        messages: {
            languageName: {
                required: fieldEmptyMessage()
            },
            languageShortName: {
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
    });
};
Template.editLanguage.events({
    'submit form': function (e) {
        e.preventDefault();

        var id = this._id;
        var lang = {
            languageName: $(e.target).find('[name=languageName]').val(),
            shortName: $(e.target).find('[name=languageShortName]').val()
        };
        Meteor.call('updateLanguage', id, lang, function (error) {
            if (error) {
                if (typeof Errors === 'undefined')
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else {
                    throwError(error.reason);
                }
            } else {
                Router.go('listLanguages');
            }
        });
    },
    'reset form': function () {
        Router.go('listLanguages');
    }
});

Template.editLanguage.helpers({
    'language': function (id) {
        return Languages.findOne({_id: id});
    }
});
