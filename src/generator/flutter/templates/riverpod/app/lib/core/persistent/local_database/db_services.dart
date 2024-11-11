import 'package:logging/logging.dart';
import 'package:sembast/sembast.dart';


import '../../utils/config.dart';
import 'db.dart';

// import 'database_constants.dart';
final log = Logger('DatabaseServices');

class DatabaseServices {
  var key = '';
  // A Store with int keys and Map<String, dynamic> values.
  // This Store acts like a persistent map, values of which are Flogs objects converted to Map
  final _appsStore = intMapStoreFactory.store(storeName);

  // Private getter to shorten the amount of code needed to get the
  // singleton instance of an opened database.
  get _db async => await LocalDatabase.db.database(key);

  // late Future<Database> _db;

  final DatabaseServices _singleton = DatabaseServices();

  // Singleton instance
  // static final DatabaseServices _singleton = DatabaseServices._();

  // A private constructor. Allows us to create instances of DatabaseServices
  // only from within the DatabaseServices class itself.
  // DatabaseServices._();

  // Singleton accessor
  DatabaseServices get db => _singleton;

  /* DatabaseServices(String password)  {
    _db = await LocalDatabase.db.database(key);
  } */

  password(String password) {
    key = password;
  }

  close() async {
    (await _db).close();
  }

  saveToken(String token) async {
    await _appsStore.record(0).add(await _db, {'id_token': token});
  }

  deleteToken() async {
    final finder = Finder(filter: Filter.byKey(0));
    return (await _appsStore.delete(await _db, finder: finder));
  }

  fetchToken() async {
    final finder = Finder(filter: Filter.byKey(0));
    Map<String, Object?> value = {'id_token': ''};
    String token = '';
    try {
      var v = (await _appsStore.find(await _db, finder: finder)).first;
      value = v.value;
      token = value['id_token'].toString();
    } catch (e) {
      log.info(e.toString());
    }
    return token;
  }

  fetchObject(key) async {
    final finder = Finder(filter: Filter.byKey(key));
    try {
      return (await _appsStore.find(await _db, finder: finder)).first;
    } catch (e) {
      log.info(e.toString());
    }
  }

/* 
  getAllAppDatas() async {
    final recordSnapshots = await _appsStore.find(
      await _db,
    );

    // Making a List<AppData> out of List<RecordSnapshot>
    return recordSnapshots.map((snapshot) {
      final appData = AppData.fromMap(snapshot.value);
      // An ID is a key of a record from the database.
      appData.id = snapshot.key;
      return appData;
    }).toList();
  } */
}
