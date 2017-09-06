Template.profileList.created = function () {
    this.usersRV = new ReactiveVar ();
};

Template.profileList.rendered = function () {
    var self = Template.instance ();
    this.autorun ( function () {
        var users = Users.find ( {
            $where: function () {
                return ( this._id == Meteor.userId () );
            }
        } );
        var tab = [];
        users.forEach ( function ( item ) {
            tab.push ( item._id );
        } );
        self.usersRV.set ( tab );
    } );
};

Template.profileList.events ( {
    'click .glyphicon-trash': function ( event, template ) {
        Session.set ( 'userInScope', this );
    },
    'click .glyphicon-info-sign': function ( event, template ) {
        Session.set ( 'userInScope', this );
    },
    'click .glyphicon-cog': function ( event, template ) {
        Session.set ( 'userInScope', this );
    },
    'click .glyphicon-pencil': function ( event, template ) {
        Session.set ( 'userInScope', this );
    }
} );
Template.profileList.helpers ( {
    'settings': function () {
        var self = Template.instance ();
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            showColumnToggles: false, 
            enableRegex: false, 
            fields: [
                { key: 'profile.firstName', label: TAPi18n.__ ( 'txv.F_NAME' ) },
                { key: 'profile.lastName', label: TAPi18n.__ ( 'txv.L_NAME' ) },
                { key: 'profile.city', label: TAPi18n.__ ( 'txv.CITY' ) },
                { key: 'Kontakt', label: TAPi18n.__ ( 'txv.CONTACT' ), tmpl: Template.userEmailContact }
            ],
            rowClass: function ( item ) {
                var tab = self.usersRV.get ();
                if ( _.contains ( tab, item._id ) ) {
                    return 'myselfClass';
                }
            }
        };
    }
} );
Template.userEmailContact.helpers ( {
    myProfile: function ( id ) {
        return id==Meteor.userId () ? true : false;
    }
} );
