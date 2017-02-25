Accounts.config({
    forbidClientAccountCreation: true,
    loginExpirationInDays: null
});

Users.deny({
    insert: function(){
        return true;
    },
    update: function () {
        return true;
    },
    remove: function(){
        return true;
    }
});