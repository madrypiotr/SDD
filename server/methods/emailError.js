Meteor.methods({
    addEmailError: function(emailError){
        EmailError.insert({
            createdAt: new Date(),
            idIssue: emailError.idIssue,
            idUserDraft: emailError.idUserDraft,
            idUser: emailError.idUser,
            type: emailError.type,
            email: emailError.email
        });
    }
});