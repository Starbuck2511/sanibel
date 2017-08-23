export class AppConfig {
    public  static FIREBASE_CONFIG: any = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        storageBucket: "",
        messagingSenderId: ""
    };

    public static DATETIME_CONFIG: any = {
        monthNames: "Januar, Februar, Maerz, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember",
        monthShortNames: "Jan, Feb, Mar, Apr, Mai, Jun, Jul, Aug, Sep, Okt, Nov, Dez",
        dayNames: "Sonntag, Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag",
        dayShortNames: "So, Mo, Di, Mi, Do, Fr, Sa"
    };

    public static ONE_SIGNAL_CONFIG: any = {
        appId: ""
    };

    public static SENTRY_CONFIG: any = {
        dns: ""
    };
}
