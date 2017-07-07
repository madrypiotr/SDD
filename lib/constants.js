// enumy
KWESTIA_STATUS = {
    DELIBEROWANA: "deliberowana",
    ARCHIWALNA: "archiwalna",
    ADMINISTROWANA : "administrowana",
    GLOSOWANA: "głosowana",
    REALIZOWANA: "realizowana",
    KOSZ: "kosz",
    OSOBOWA: "osobowa",
    HIBERNOWANA: "hibernowana",
    STATUSOWA: "statusowa",//o nadanie statusu doradcy na honorowego
    OCZEKUJACA:"oczekująca",//oczekuje na akceptacje zaproszenia na honorowego
    ZREALIZOWANA: "zrealizowana"
};

KWESTIA_TYPE={
  "ACCESS_ZWYCZAJNY":"czlonkowstwo zwyczajne",
  "ACCESS_DORADCA":"czlonkowstwo doradcze",
  "GLOBAL_PARAMETERS_CHANGE": "zmiana parametrów",
   "BASIC":"podstawowa"
};

KWESTIA_ACTION={
  "INVITATION_WAITING_TIME_EXPIRED":"Czas oczekiwania na odpowiedź ze strony zaproszonego minął",
  "DELIBERATION_EXPIRED":"Czas deliberacji kwestii minął",
  "NEGATIVE_PRIORITY":"Siła priorytetu w realizacjii była mniejsza od priorytetu w deliberacji (i) głosowaniu *(-1)",
  "NEGATIVE_PRIORITY_VOTE":"Siła priorytetu w głosowaniu była mniejsza od 1",
  "SPECIAL_COMMENT_BIN" :"Wartość priorytetu i kworum w komentarzu specjalnym o tym zdecydowały"
};

SENDING_EMAIL_PROBLEMS={
  "NO_ACTVATION_LINK": "Użytkownik nie mógł aktywować konta, ponieważ z powodu błędu serwera pocztowego nie otrzymał linka aktywacyjnego"
};

DISCUSSION_OPTIONS = {
    POST_CHARACTERS_DISPLAY: 300,
    POST_ANSWER_CHARACTERS_DISPLAY: 200
};

KWORUM_TYPES = {
    ZWYKLA: "zwykla",
    STATUTOWA: "statutowa"
};

POSTS_TYPES = {
    //domyślna wartość -> komentarz zwykły
    DEFAULT: "default",
    //komentarz, który oznacza chęć przeniesienia kwestii do archiwum
    ARCHIWUM: "archiwum",
    //komentarz, który oznacza chęć przeniesienia do kosza
    KOSZ: "kosz",
    //komentarz, który oznacza chęć przeniesienia kwestii z archiwum do deliberacji
    DELIBERACJA: "deliberacja",
    //komentarz, który oznacza chęć przeniesienia kwesti z realizacji na zrealizowane
    ZREALIZOWANA: "zrealizowana",
    RAPORT: "raport"
};

LANGUAGES = {
    DEFAULT_LANGUAGE: "pl"
};

USERTYPE = {
    ADMIN: "admin",
    CZLONEK : "członek",
    DORADCA : "doradca",
    WSPARCIE: "wsparcie",
    ZWIESZONY:"zawieszony",
    USUNIETY:"usunięty",
    GOSC: "gość"
};

NOTIFICATION_TYPE = {
    NEW_ISSUE: "Pojawienie się nowej Kwestii",
    ISSUE_NO_PRIORITY:"Brak aktywności w Kwestii",
    ISSUE_NO_PRIORITY_REALIZATION:"Brak aktywności w Kwestii w Realizacjii",
    MESSAGE_FROM_USER:"Wiadomość od użytkownika",
    LOOBBING_MESSAGE:"Lobbowanie Kwestii",
    APPLICATION_CONFIRMATION: "Przyjęcie wniosku aplikacyjnego",
    APPLICATION_ACCEPTED: "Pozytywne rozpatrzenie wniosku aplikacyjnego",
    APPLICATION_REJECTED: "Odrzucenie wniosku aplikacyjnego",
    VOTE_BEGINNING:"Rozpoczęcie głosowania Kwestii",
    LACK_OF_REALIZATION_REPORT: "Komunikat o braku Raportu Realizacyjnego",
    FIRST_LOGIN_DATA: "Wysłanie danych do logowania do nowo utworzonego konta",
    RESET_PASSWORD: "Wysłanie linku do resetowania hasła"
};

RADKING = {
    NADANIE_PRIORYTETU: 1,
    DODANIE_ODNIESIENIA: 2,
    DODANIE_KOMENTARZA: 5,
    ZLOZENIE_RAPORTU_REALIZACYJNEGO: 5,
    UDZIAL_W_ZESPOLE_REALIZACYJNYM: 10,
    DODANIE_KWESTII: 12,
    AWANS_KWESTII_DO_REALIZACJI: 20,
    WYCOFANIE_KWESTII_DO_ARCHIWUM: -25,
    WYJSCIE_Z_ZESPOLU_REALIZACYJNEGO: -30,
    WYCOFANIE_KWESTII_DO_KOSZA: -40
};

TXV = {
    POLISH: "polski",
    PL: "pl",
    ENGLISH: "angielski",
    EN: "en",
    GERMAN: "niemiecki",
    DE: "de",
    SWEDISH: "szwedzki",
    SE: "se",
    FRENCH: "francuski",
    FR: "fr",
    CZECH: "czeski",
    CZ: "cz",
    ORG_NAME: "Nazwa organizacji",
    TERITORY: "Terytorium",
    TERITADR: "Adres",
    CONTACT: "Kontakt",
    CONTACTS: "Kontakty",
    STATUT: "Statut",
    VOTE_TIME: "Czas głosowania(w godzinach)",
    WAITING_TIME: "Czas wyczekiwania kwestii i komentarzy specjalnych (w dniach)",
    MAX_ISSUE_IN_VOTING: "Maksymalna ilość kwestii w głosowaniu",
    FREQ_ADD_ISSUE: "Częstotliwość dodania kwestii (w minutach)",
    FREQ_ADD_REFER: "Częstotliwość dodania odniesienia (w minutach)",
    FREQ_ADD_REPPO: "Okres składania Raportów Realizacyjnych (w dniach)",
    MOVE_TO_ARCH: "Proponuję przenieść tę Kwestię do Archiwum! Proszę o dyskusję i nadanie priorytetu.",
    MOVE_TO_DELIB: "Proponuję przenieść tę Kwestię do Deliberacji! Proszę o dyskusję i nadanie priorytetu.",
    MOVE_TO_TRASH: "Proponuję przenieść tę Kwestię do Kosza!  Proszę o dyskusję i nadanie priorytetu.",
    MISSING_RULES: "brak regulaminu",
    APPLYING: "Aplikowanie - ",
    APPLY_SYSTEM: "Aplikacja o przyjęcie do systemu jako ",
    GL_PAR_CHANGE5: "Propozycja zmiany parametru globalnego  przez ",
    GL_PAR_CHANGE6: "Propozycja zmiany parametru globalnego",
    ADOPT: "Przyjęcie",
    STATUTORY: "Statutowe",
    ORGANIZATIONAL: "Organizacyjne",
    INTERNAL_AFFAIRS: "Dotyczy wszelkich spraw wewnętrznej organizacji naszej społeczności. Wszyskkich użytkowników tej instancji systemu.",
    ZR_PERSONS: "Zespół Realizacyjny ds. Osób",
};
