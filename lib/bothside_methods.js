liczenieKworumZwykle = function () {
    var liczbaUzytkownikow = Users.find({'profile.userType': USERTYPE.CZLONEK }).count();
    var potega = 7 / 9;
    var liczba = 4 / 7;
    var kworum = Math.pow(liczbaUzytkownikow, potega) * liczba;
    if(kworum<3)
        kworum = 3;

    return Math.round(kworum);
};

liczenieKworumStatutowe = function () {
    var liczbaUzytkownikow = Users.find({'profile.userType': USERTYPE.CZLONEK }).count();
    var kworum = liczbaUzytkownikow / 3 * 2;
    if(kworum<3)
        kworum = 3;
    return Math.round(kworum);
};

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours()+h);
    return this;
};

replacePolishChars = function (_elem) {
    return _elem.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
};