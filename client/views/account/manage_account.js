/*
``client\views\account\`` manage_account.js
## Helper for the template manage_account.html */


Template.manageAccount.helpers({
    test: function (emails) {
        return emails[0].address;
    }
});
