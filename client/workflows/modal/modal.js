Template.modalInner.helpers({
    modalTitle: function(){
        return Session.get("modalTitle");
    },
    modalContent: function(){
        return Session.get("modalContent");
    }
});