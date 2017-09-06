Kwestia = new Mongo.Collection('kwestia');

if (Meteor.isServer) {
    ReactiveTable.publish('KwestiaList', Kwestia, {
        'czyAktywny': true,
        'status':{$in:['deliberowana','administrowana','osobowa']}
    });

    ReactiveTable.publish('GlosowanieList', Kwestia, {
        'czyAktywny': true,
        'status':'głosowana'
    });
    ReactiveTable.publish('ArchiwumList', Kwestia, {
        'czyAktywny': true,
        'status':'archiwalna'
    });
    ReactiveTable.publish('KoszList', Kwestia, {
        'czyAktywny': false
    });
    ReactiveTable.publish('HibernowaneList', Kwestia, {
        'czyAktywny': true,
        'status':'hibernowana'
    });
    ReactiveTable.publish('RealizacjaList', Kwestia, {
        'czyAktywny': true,
        'status':'realizowana'
    });
    ReactiveTable.publish('ZrealizowaneList', Kwestia, {
        'czyAktywny': true,
        'status':'zrealizowana'
    });
    ReactiveTable.publish('MojeKwestieList', Kwestia, {
        'czyAktywny': true,
        'status':'zrealizowana'
    });
}