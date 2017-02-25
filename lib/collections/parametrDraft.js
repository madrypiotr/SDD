ParametrDraft = new Mongo.Collection('parametrDraft');

ParametrDraft.allow({
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
