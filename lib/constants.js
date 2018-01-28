// enumy
KWESTIA_STATUS = {
    DELIBEROWANA: 'deliberowana',
    ARCHIWALNA: 'archiwalna',
    ADMINISTROWANA : 'administrowana',
    GLOSOWANA: 'głosowana',
    REALIZOWANA: 'realizowana',
    KOSZ: 'kosz',
    OSOBOWA: 'osobowa',
    HIBERNOWANA: 'hibernowana',
    STATUSOWA: 'statusowa',//o nadanie statusu doradcy na honorowego
    OCZEKUJACA:'oczekująca',//oczekuje na akceptacje zaproszenia na honorowego
    ZREALIZOWANA: 'zrealizowana'
};

KWESTIA_TYPE = {
    'ACCESS_ZWYCZAJNY':'czlonkowstwo zwyczajne',
    'ACCESS_DORADCA':'czlonkowstwo doradcze',
    'GLOBAL_PARAMETERS_CHANGE': 'zmiana parametrów',
    'BASIC':'podstawowa'
};

KWESTIA_ACTION = {
    'INVITATION_WAITING_TIME_EXPIRED':'Czas oczekiwania na odpowiedź ze strony zaproszonego minął',
    'DELIBERATION_EXPIRED':'Czas deliberacji kwestii minął',
    'NEGATIVE_PRIORITY':'Siła priorytetu w realizacjii była mniejsza od priorytetu w deliberacji (i) głosowaniu *(-1)',
    'NEGATIVE_PRIORITY_VOTE':'Siła priorytetu w głosowaniu była mniejsza od 1',
    'SPECIAL_COMMENT_BIN' :'Wartość priorytetu i kworum w komentarzu specjalnym o tym zdecydowały'
};

SENDING_EMAIL_PROBLEMS = {
    'NO_ACTVATION_LINK': 'Użytkownik nie mógł aktywować konta, ponieważ z powodu błędu serwera pocztowego nie otrzymał linka aktywacyjnego'
};

DISCUSSION_OPTIONS = {
    POST_CHARACTERS_DISPLAY: 300,
    POST_ANSWER_CHARACTERS_DISPLAY: 200
};

KWORUM_TYPES = {
    ZWYKLA: 'zwykla',
    STATUTOWA: 'statutowa'
};

POSTS_TYPES = {
    //domyślna wartość -> komentarz zwykły
    DEFAULT: 'default',
    //komentarz, który oznacza chęć przeniesienia kwestii do archiwum
    ARCHIWUM: 'archiwum',
    //komentarz, który oznacza chęć przeniesienia do kosza (Archiwum)
    KOSZ: 'kosz',
    //komentarz, który oznacza chęć przeniesienia kwestii z archiwum do deliberacji
    DELIBERACJA: 'deliberacja',
    //komentarz, który oznacza chęć przeniesienia kwesti z realizacji na zrealizowane
    ZREALIZOWANA: 'zrealizowana',
    RAPORT: 'raport'
};

LANGUAGES = {
    DEFAULT_LANGUAGE: 'pl'
};

USERTYPE = {
    ADMIN: 'admin',
    CZLONEK : 'członek',
    DORADCA : 'doradca',
    WSPARCIE: 'wsparcie',
    ZWIESZONY:'zawieszony',
    USUNIETY:'usunięty',
    GOSC: 'gość'
};

NOTIFICATION_TYPE = {
    NEW_ISSUE: 'Pojawienie się nowej Kwestii',
    ISSUE_NO_PRIORITY:'Brak aktywności w Kwestii',
    ISSUE_NO_PRIORITY_REALIZATION:'Brak aktywności w Kwestii w Realizacjii',
    MESSAGE_FROM_USER:'Wiadomość od użytkownika',
    LOOBBING_MESSAGE:'Lobbowanie Kwestii',
    APPLICATION_CONFIRMATION: 'Przyjęcie wniosku aplikacyjnego',
    APPLICATION_ACCEPTED: 'Pozytywne rozpatrzenie wniosku aplikacyjnego',
    APPLICATION_REJECTED: 'Odrzucenie wniosku aplikacyjnego',
    VOTE_BEGINNING:'Rozpoczęcie głosowania Kwestii',
    LACK_OF_REALIZATION_REPORT: 'Komunikat o braku Raportu Realizacyjnego',
    FIRST_LOGIN_DATA: 'Wysłanie danych do logowania do nowo utworzonego konta',
    RESET_PASSWORD: 'Wysłanie linku do resetowania hasła'
};
