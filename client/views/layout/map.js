Template.map.onRendered(function () {
    Session.set('mapParameterId');
    GoogleMaps.ready('mainMap', function (map) {
        var markers = [];
        var infoWindowOpened;
        Tracker.autorun(function () {
            var parameterId = Session.get('mapParameterId');
            markers.forEach(function (marker){
                marker.setMap(null);
            });
            if (infoWindowOpened) {
                infoWindowOpened.close();
            }
            markers = [];

            if (!parameterId) {
                Parametr.find({terytLocation: {$exists: true}}).forEach(function (parametr) {
                    var location = parametr.terytLocation;
                    if (!location || !location.lat || !location.lng) {
                        return;
                    }

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(location.lat, location.lng),
                        map: map.instance,
                        optimized: false,
                        _id: parametr._id
                    });

                    var listenerHandle = marker.addListener('click', function () {
                        var infowindow = new google.maps.InfoWindow({
                            content: _getInfoContent(parametr)
                        });

                        infowindow.open(map.instance, marker);
                        if (infoWindowOpened) {
                            infoWindowOpened.close();
                        }
                        infoWindowOpened = infowindow;
                    });
                    markers.push(marker);
                });
            } else {
                Meteor.users.find({
                    'profile.location': {$exists: true},
                    'profile.fullName': {$exists: true}
                }).forEach(function (user) {
                    var location = user.profile && user.profile.location;
                    if (!location || !location.lat || !location.lng) {
                        return;
                    }

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(location.lat, location.lng),
                        map: map.instance,
                        optimized: false,
                        _id: user._id
                    });

                    var listenerHandle = marker.addListener('click', function () {
                        var infowindow = new google.maps.InfoWindow({
                            content: _getUserInfoContent(user)
                        });

                        infowindow.open(map.instance, marker);
                        if (infoWindowOpened) {
                            infoWindowOpened.close();
                        }
                        infoWindowOpened = infowindow;
                    });
                    markers.push(marker);
                });
            }
        });
    });
});

var _getInfoContent = function (parametr) {
    var content = '<div class="parametrInfo">';
    content += '<div class="parametrRow">';
    content += '<strong>' + parametr.nazwaOrganizacji + '</strong><br /><br />';
    content += '<a href="#" class="btn btn-default btn-xs js-param-open" data-id="' + parametr._id + '">';
    content += 'Otwórz';
    content += '</a>';
    content += '</div>';
    return content;
};

var _getUserInfoContent = function (user) {
    var content = '<div class="parametrInfo">';
    content += '<div class="parametrRow">';
    content += '<strong>' + user.profile.fullName + '</strong><br />';
    content += '</div>';
    return content;
};

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
                fullscreenControl: true,
                mapTypeControl: false,
                rotateControl: false,
                scaleControl: false,
                streetViewControl: false,
                zoom: 5,
                zoomControl: true,
                scrollwheel: true,
                styles: [{
                    stylers: [
                        {lightness: 20},
                        {saturation: -60}
                    ]
                }]
            };
        }
    },
    mapParameterName: function () {
        var parametrId = Session.get('mapParameterId');
        if (!parametrId) {
            return false;
        }
        var parametr = Parametr.findOne(parametrId);
        return parametr && parametr.nazwaOrganizacji;
    }
});

Template.map.events({
    'click .js-param-open': function (event) {
        var $el = $(event.target);
        Session.set('mapParameterId', $el.attr('data-id'));
    },
    'click .js-close-parameter': function () {
        Session.set('mapParameterId');
    }
});
