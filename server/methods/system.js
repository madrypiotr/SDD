Meteor.methods({
    addSystemParameters: function(newSystemParameter){
        System.insert({
            systemPrefix: newSystemParameter[0].systemPrefix
        });
	},

    generateNextIssueNumber: function(){

        var systemPrefix = System.findOne().systemPrefix;
        var newFullIssueNumber = "";

        //Generating for first issue number
        if(Kwestia.find().count()==0) {

            newFullIssueNumber = systemPrefix + "AA00001";
            return newFullIssueNumber;
		}else{ 
//Generating other issue numbers
            var fullIssueNumber = Kwestia.find({}, {sort: {issueNumber: -1}}).fetch()[0].issueNumber;
            var issueNumber = parseInt(fullIssueNumber.substring(7));
            var nextIssueNumber = issueNumber + 1;
            var issuePrefix = fullIssueNumber.substring(5,7);
            var newIssuePrefix = "";
            var char1 = "";
            var char2 = "";

            if(issueNumber==99999){
                if(issuePrefix.charCodeAt(1)==90){
                    if(issuePrefix.charCodeAt(0)==90){
                        //Out of bound
                        throw new Meteor.Error("Issues max limit achieved");
                    }else{
                        char1 = String.fromCharCode(issuePrefix.charCodeAt(0) + 1);
                        char2 = String.fromCharCode(65);
                        newIssuePrefix = char1 + char2;
                    }
                }else{
                    char1 = String.fromCharCode(issuePrefix.charCodeAt(0));
                    char2 = String.fromCharCode(issuePrefix.charCodeAt(1) + 1);
                    newIssuePrefix = char1 + char2;
                }

                nextIssueNumber = 1;
            }else{
                newIssuePrefix = issuePrefix;
                nextIssueNumber = issueNumber + 1;
            }

            var nextIssueNumberString = nextIssueNumber.toString();
            switch (nextIssueNumberString.length){
                case 1:
                    nextIssueNumberString = "0000" + nextIssueNumberString;
                    break;
                case 2:
                    nextIssueNumberString = "000" + nextIssueNumberString;
                    break;
                case 3:
                    nextIssueNumberString = "00" + nextIssueNumberString;
                    break;
                case 4:
                    nextIssueNumberString = "0" + nextIssueNumberString;
                    break;
            }

            newFullIssueNumber = systemPrefix + newIssuePrefix + nextIssueNumberString;
            return newFullIssueNumber;
        }
    }
});