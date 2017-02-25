Template.paginationButton.helpers({
    pageActive: function(){
        if(this.index === Session.get('selectedPagination')){
            return "active";
        }
    },
    getPage: function(){
        return this.index + 1;
    }
});