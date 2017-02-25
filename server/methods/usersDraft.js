Meteor.methods({
    addUserDraft: function(newUser) {
     var id= UsersDraft.insert({
            username: newUser[0].login,
            email: newUser[0].email,
            profile: {
                firstName: newUser[0].firstName,
                lastName: newUser[0].lastName,
                fullName: newUser[0].firstName + ' ' + newUser[0].lastName,
                address: newUser[0].address,
                zip: newUser[0].zip,
                language:newUser[0].language,
                userType:newUser[0].userType,
                uwagi:newUser[0].uwagi,
                idUser:newUser[0].idUser,
                isExpectant:newUser[0].isExpectant,
                city:newUser[0].city,
                pesel:newUser[0].pesel
            },
             czyZrealizowany:false,
             linkAktywacyjny:null,
             czyAktywny:true,
             dataWprowadzenia:new Date(),
             licznikKlikniec:0
        });
        return id;

    },
    removeUserDraft: function(id){
        UsersDraft.update({_id:id},{$set:{czyAktywny: false,czyZrealizowany:true}});
    },
    removeUserDraftAddNewIdUser: function(id,idUser){
        UsersDraft.update({_id:id},{$set:{czyAktywny: false,czyZrealizowany:true,'profile.idUser':idUser}});
    },
    removeUserDraftNotZrealizowany: function(id){
        UsersDraft.update({_id:id},{$set:{czyAktywny: false,czyZrealizowany:false}});
    },
    removeUserDraftNotZrealizowanyLicznik: function(id,licznik){
        UsersDraft.update({_id:id},{$set:{czyAktywny: false,czyZrealizowany:false,licznikKlikniec:licznik}});
    },
    setZrealizowanyActivationHashUserDraft:function(id,activationLink,realization){
        UsersDraft.update({_id:id},{$set:{linkAktywacyjny:activationLink,czyZrealizowany:realization}});
    },
    setActivationHashUserDraft:function(id,activationLink){
        UsersDraft.update({_id:id},{$set:{linkAktywacyjny:activationLink}});
    },
    updateLicznikKlikniec:function(id,counter){
        UsersDraft.update({_id:id},{$set:{licznikKlikniec:counter}});
    },
});
