Template.mainpage.rendered = function() {
};

Template.mainpage.helpers({
    isAdminUser: function() {
        return IsAdminUser();
    }
});