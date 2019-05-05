/*
``client\views\account\`` manage_account.js
## Helper for the template manage_account.html */


Template.manageAccount.helpers({
    test: function (emails) {
        return emails[0].address;
    },
    idKwestia: () => {
        const userId =  Meteor.userId();
        const kwestia = Kwestia.findOne({idUser: userId});

        return kwestia && kwestia._id;
    }
});

Template.manageAccount.events({
    'click #doKosza': function (e) {
        e.preventDefault();
        var idKw = e.target.name;
        var issue = Kwestia.findOne({_id: idKw});

        isIssueAllowedToArchiveBin(issue, () => {
            var z = Posts.findOne({idKwestia: idKw, postType: POSTS_TYPES.KOSZ});
            if (z) {
                $('html, body').animate({
                    scrollTop: $('.doKoszaClass').offset().top
                }, 600);
            } else {
                $('#uzasadnijWyborKosz').modal('show');
            }
        });
    }
});

var isIssueAllowedToArchiveBin = function (issue, onConfirm) {
    const text = TAPi18n.__('txv.GL_PAR_CHANGE3');

    bootbox.confirm(TAPi18n.__('txv.GL_PAR_INFO') + text + '!', confirm => {
        if (confirm) {
            onConfirm();
        }
    });
};
