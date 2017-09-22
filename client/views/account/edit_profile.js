/*
``client\views\account\`` edit_profile.js
## Rendering, events and helpers for the template edit_profile.html */


Template.profileEdit.rendered = function () {
    $('#profileForm').validate({
        rules: {
            zipcode: {
                zipCodeValidation1: true,
                zipCodeValidation2: true
            }
        },
        messages: {
            name: {
                required: fieldEmptyMessage
            },
            surname: {
                required: fieldEmptyMessage
            },
            address: {
                required: fieldEmptyMessage
            },
            zipcode: {
                required: fieldEmptyMessage
            }
        },
        highlight: highlightFunction,
        unhighlight: unhighlightFunction,
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

Template.profileEdit.helpers({
    email: function () {
        return getEmail(this);
    },

    isSelected: function (gender) {
        var gen = this.profile.gender;
        if (gen == gender)
            return 'checked';
        return '';
    },
    userZwyczajny: function () {
        return this.profile.userType == USERTYPE.CZLONEK ? true : false;
    }
});

Template.profileEdit.events({
    'submit form': function (e) {
        e.preventDefault();

        var currentUserId = this._id;
        var userType = Users.findOne({_id: currentUserId}).profile.userType;
        if (isNotEmpty($(e.target).find('[name=name]').val(), 'imię') &&
            isNotEmpty($(e.target).find('[name=surname]').val(), 'nazwisko')) {
            var userProperties = {
                profile: {
                    firstName: $(e.target).find('[name=name]').val(),
                    lastName: $(e.target).find('[name=surname]').val(),
                    fullName: $(e.target).find('[name=name]').val() + ' ' + $(e.target).find('[name=surname]').val(),
                    address: $(e.target).find('[name=address]').val(),
                    zip: $(e.target).find('[name=zipcode]').val(),
                    city: $(e.target).find('[name=city]').val(),
                    userType: userType
                }
            };
            Meteor.call('updateUser', currentUserId, userProperties, function (error) {
                if (error) {
                    // optionally use a meteor errors package
                    if (typeof Errors === 'undefined')
                        Log.error(TAPi18n.__('txv.ERROR') + error.reason);
                    else {
                        if (error.error === 409)
                            throwError(error.reason);
                    }
                } else {
                    Router.go('manage_account');
                }
            });
        } else {
            return false;
        }
    }
});
