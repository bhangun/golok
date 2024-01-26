// General
const appName = 'Golok Apps';

// Caution! use your host IP instead of LOCALHOST
// because it not recognize on emulator

const baseURL = 'http://localhost';

List<String> contentTypes = [
  "application/json",
  "application/xml",
  "application/x-www-form-urlencoded"
];

String contentType =
    contentTypes.isNotEmpty ? contentTypes[0] : "application/json";


// Authentication
const token = "token";

// Store Name
String storeName = 'Golok';

// DB Name
const dbName = 'Golok.db';

// Fields
const fieldId = 'id';

// Timeout
const int timeoutReceive = 5000;
const int timeoutConnection = 5000;


// Icon Images
const String iconApp = 'assets/icons/ic_appicon.png';
const String imageLogin = 'assets/images/img_login.jpg';
const String imageSplash = 'assets/icons/logo-golok.png';