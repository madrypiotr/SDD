Template.kwestiaDetails.helpers ( {
    protectorZR: function () {
        if ( !Meteor.userId () ) return false;
        var zr=ZespolRealizacyjny.findOne ( { _id:"jjXKur4qC5ZGPQkgN" } );
        if ( zr ) {
            if ( zr.protector )
                return zr.protector==Meteor.userId () ? true : false;
        }
    },
    isOsobowa: function ( typ ) {
        return  ( _.contains ( [KWESTIA_TYPE.ACCESS_ZWYCZAJNY,KWESTIA_TYPE.ACCESS_DORADCA],typ ) ) ? true : false;
    },
    isGlobalParamsChange: function ( typ ) {
        return typ==KWESTIA_TYPE.GLOBAL_PARAMETERS_CHANGE ? true : false;
    }
 } );