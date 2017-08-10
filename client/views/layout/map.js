// Template.map.onRendered(function () {
//     GoogleMaps.ready('mainMap', function (map) {
//     });
// });

Template.map.helpers({
    isAdminUser: function () {
        return IsAdminUser();
    },
    isZwyczajnyLogged: function () {
        if (IsAdminUser())
            return false;
        else {
            return Meteor.user().profile.userType == USERTYPE.CZLONEK ? true : false;
        }
    },
    mapOptions: function () {
        if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(51.9852126, 19.2408041),
                fullscreenControl: false,
                mapTypeControl: false,
                rotateControl: false,
                scaleControl: false,
                streetViewControl: false,
                zoom: 5,
                zoomControl: true,
                // scrollwheel: false,
                styles: [{
                    stylers: [
                        {lightness: 20},
                        {saturation: -60}
                    ]
                }]
            };
        }
    }
});
