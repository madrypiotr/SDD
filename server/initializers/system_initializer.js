Meteor.startup(function(){
    //var systemParameters = [
    //    {
    //        "systemPrefix": generateSystemPrefix()
    //    }
    //];
    if (System.find().count() == 0) {
        //Meteor.call('addSystemParameters', systemParameters, function (error, ret) {
        //    if (error) {
        //        if (typeof Errors === "undefined")
        //            Log.error('Error: ' + error.reason);
        //        else {
        //            throwError(error.reason);
        //        }
        //    }
        //});
        System.insert({
            systemPrefix: "AA001"
        });
    }
});

//TO DO: This function is prepared for next system instances but need to be modified when it will be ready
//generateSystemPrefix = function(){
//
//    var newSystemPrefix = "";
//
//    //Generating first system prefix
//    if(Kwestia.find().count()==0) {
//
//        newSystemPrefix = "AA001";
//        return newSystemPrefix;
//    }else{ //Generating next system prefix
//
//        var systemPrefix = System.find({}, {sort: {systemPrefix: -1}}).fetch()[0].systemPrefix;
//        var systemNumber = parseInt(systemPrefix.substring(2));
//        var nextSystemNumber = systemNumber + 1;
//        var systemPrePrefix = systemPrefix.substring(0,2);
//        var newSystemPrePrefix = "";
//        var char1 = "";
//        var char2 = "";
//
//        if(systemNumber==999){
//            if(systemPrePrefix.charCodeAt(1)==90){
//                if(systemPrePrefix.charCodeAt(0)==90){
//                    //Out of bound
//                    throw new Meteor.Error("Issues max limit achieved");
//                }else{
//                    char1 = String.fromCharCode(systemPrePrefix.charCodeAt(0) + 1);
//                    char2 = String.fromCharCode(65);
//                    newSystemPrePrefix = char1 + char2;
//                }
//            }else{
//                char1 = String.fromCharCode(systemPrePrefix.charCodeAt(0));
//                char2 = String.fromCharCode(systemPrePrefix.charCodeAt(1) + 1);
//                newSystemPrePrefix = char1 + char2;
//            }
//
//            nextSystemNumber = 1;
//        }else{
//            newSystemPrePrefix = systemPrePrefix;
//            nextSystemNumber = systemNumber + 1;
//        }
//
//        var nextSystemNumberString = nextSystemNumber.toString();
//        switch (nextSystemNumberString.length){
//            case 1:
//                nextSystemNumberString = "00" + nextSystemNumberString;
//                break;
//            case 2:
//                nextSystemNumberString = "0" + nextSystemNumberString;
//                break;
//        }
//
//        newSystemPrefix = newSystemPrePrefix + nextSystemNumberString;
//        return newSystemPrefix;
//    }
//};