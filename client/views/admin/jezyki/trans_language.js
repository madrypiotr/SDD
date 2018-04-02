
Template.transLanguage.events({
    'reset form': function () {
        Router.go('listLanguages');
    }
});


Template.transLanguage.helpers({
	
    languageCount: function () {
        return Languages.find().count();
    },
    languages: function () {
        return Languages.find({}).fetch();
		
		
   },
    language0: function (id) {
        return Languages.findOne({_id: 0});
    },
	
    language1: function () {
        return Languages.find(1);
    },
	
    language2: function () {
        return Languages.find(2);
    },
	
    language3: function () {
        return Languages.find(3);
    }
	
});
