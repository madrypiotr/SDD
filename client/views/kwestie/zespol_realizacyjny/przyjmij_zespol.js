Template.listZespolRealizacyjnyDoubleModalInner.helpers ( {
    'settings': function () {
        return {
            rowsPerPage: 10,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false, 
            enableRegex: false, 
            fields: [
                {key: 'nazwa', label: TAPi18n.__ ( 'txv.NAME_OF_TEAM' )},
                {key: 'zespol', label: TAPi18n.__ ( 'txv.SPECIF_OF_TEAM' ), tmpl: Template.zespolDoubleTemplate},
                {key: 'options', label: "", tmpl: Template.zespolDoubleTemplateOptions}
            ]
        };
    },
    ZRDoubleList: function () {
        var val=Session.get ( "zespolRealizacyjnyDouble" );
        if ( val ) {

            var zesp = ZespolRealizacyjny.find ( { _id: {$in:val} } );
            if ( zesp ) {

                return zesp;
                Session.setPersistent ( 'zespolRealizacyjnyDouble', null );
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
 } );

Template.zespolDoubleTemplate.helpers ( {
    zespolR: function () {
        var tab = [];
        for ( var i=0;i<this.zespol.length;i++ ) {
            var z = this.zespol[i];
            if ( z ) {
                var foundName = Users.findOne ( { _id: z } ).profile.fullName;
                if ( foundName ) {
                    tab.push ( " " + foundName );
                }
            }
        }
        return tab;
    }
 } );

Template.listZespolRealizacyjnyDoubleModalInner.events ( {
    'click #powrotButton': function () {
        $ ( "#decyzjaModalId" ).modal ( "show" );
    },
    'click #przyjmijZR': function () {
        if ( isUserInZRNotification ( this._id )==false ) {//jezeli jestem w  takowym zespole
            powolajZRFunction ( Session.get ( "idKwestia" ), this._id );
        }
    }
 } );
