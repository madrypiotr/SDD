Template.layout.rendered = function() {
};

Template.layout.helpers({
    isAdminUser: function() {
        return IsAdminUser();
    }
});