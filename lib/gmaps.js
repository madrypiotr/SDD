if (Meteor.isClient) {
    Meteor.startup(function () {
        GoogleMaps.load({
            libraries: 'places',
            key: 'AIzaSyChSOxLBGFhh1uT2eRGbv0OSl6m4sVgPvA'
        });
    });
}
