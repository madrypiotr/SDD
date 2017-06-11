Template.addLanguage.rendered = function () {
    $("#languageForm").validate({
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
    })
};
Template.addLanguage.events({
    'submit form': function (e) {
        e.preventDefault();
        var newLang =
        {
            languageName: $(e.target).find('[name=languageName]').val(),
            shortName: $(e.target).find('[name=languageShortName]').val(),
            isEnabled: false,
            czyAktywny: true
        };
        Meteor.call('addLanguage', newLang, function (error) {
            if (error) {
                if (typeof Errors === "undefined")
                    Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                else {
                    throwError(error.reason);
                }
            }
            else {
                Router.go('listLanguages');
            }
        });
    },
    'reset form': function () {
        Router.go('listLanguages');
    }
});
