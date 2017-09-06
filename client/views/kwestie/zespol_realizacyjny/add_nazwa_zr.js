Template.addNazwaModalInner.rendered = function () {
    $ ( '#nazwaZR' ).css ( 'visibility', 'visible' );
    $ ( 'addNazwa' ).validate ( {
        rules:{
            nazwaZR: {
                checkExistsNazwaZespoluRealizacyjnego : true
            }
        },
        messages: {
            nazwaZR: {
                required: fieldEmptyMessage ()
            }
        },
        highlight: function ( element ) {
            highlightFunction ( element );
        },
        unhighlight: function ( element ) {
            unhighlightFunction ( element );
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function ( error, element ) {
            if ( element.length ) {
                error.insertAfter ( element );
            } else {
                error.insertAfter ( element );
            }
        }
    } );
};

Template.addNazwaModal.events ( {
    'click #zapiszButton': function ( e ) {
        e.preventDefault ();

        var idKwestia=this._id;
        var nazwa = document.getElementById ( 'nazwaZR' ).value;
        var zespoly = ZespolRealizacyjny.find ( {czyAktywny: true } );
        if ( nazwa.toLowerCase ().trim () =='' ) {
            $ ( '#nazwaZR' ).css ( 'visibility', 'visible' );
            GlobalNotification.error ( {
                title: TAPi18n.__ ( 'txv.ERROR' ),
                content: TAPi18n.__ ( 'txv.FILL_NAME_OF_TEAM' ),
                duration: 4 
            } );
        }
        else {
            var found = false;
            var text = TAPi18n.__ ( 'txv.IMPLEMENTATION_TEAM_FOR' ) + nazwa;
            zespoly.forEach ( function ( zespol ) {
                if ( _.isEqual ( zespol.nazwa.toLowerCase ().trim (), text.toLowerCase ().trim () ) )
                    found = true;
            } );
            if ( found == true ) {
                $ ( '#nazwaZR' ).css ( 'visibility', 'visible' );
                GlobalNotification.error ( {
                    title: TAPi18n.__ ( 'txv.ERROR' ),
                    content: TAPi18n.__ ( 'txv.NAME_OF_TEAM_EXIST' ),
                    duration: 4 
                } );
            } else {
                $ ( '#nazwaZR' ).css ( 'visibility', 'hidden' );
                var text = TAPi18n.__ ( 'txv.IMPLEMENTATION_TEAM_FOR' ) + nazwa;
                var kwestia = Kwestia.findOne ( { _id: idKwestia } );
                if ( kwestia ) {
                    var zespol = ImplemTeamDraft.findOne ( { _id: kwestia.idZespolRealizacyjny } );
                    if ( zespol ) {
                        var tablicaZR = zespol.zespol.slice ();
                        tablicaZR.push ( Meteor.userId () );
                        var newZespol={
                            nazwa:text,
                            zespol:tablicaZR
                        };
                        Meteor.call ( 'updateImplemTeamDraft', kwestia.idZespolRealizacyjny, newZespol, function ( error, ret ) {
                            if ( error ) {
                                if ( typeof Errors === 'undefined' )
                                    Log.error ( TAPi18n.__ ( 'txv.ERROR' ) + error.reason );
                                else {
                                    throwError ( error.reason );
                                }
                            }
                            else {
                                $ ( '#addNazwa' ).modal ( 'hide' );
                            }
                        } );
                    }
                }
            }
        }
    },
	    'click #cancelButton': function ( e ) {
        // (pm) jak i gdzie powr�ci�?
    }
} );
