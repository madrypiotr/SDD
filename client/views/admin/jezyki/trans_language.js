
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
    languageSource0: function () {
		wart = "pl";
		return wart
        
    },
	
    languageSource1: function () {
		wart = "en";
		return wart
    },
	
    languageSource2: function () {
		wart = "fr";
		return wart
    },
	
	
    languageTarget0: function () {
		wart = "en";
		return wart
        
    },
	
    languageTarget1: function () {
		wart = "pl";
		return wart
    },
	
    languageTarget2: function () {
		wart = "fr";
		return wart
    }
	
	
});
