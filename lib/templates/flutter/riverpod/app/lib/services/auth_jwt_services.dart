import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:logging/logging.dart';

import '../modules/user/models/user.dart';
import 'local_database/db_services.dart';
import 'rest/rest_services.dart';

final log = Logger('AuthServices');

class AuthServices {
  late DatabaseServices db;

  /// Path authenticate,
  /// Post authorize & Get isAuthorize
  static login(String username, String password,
      [bool rememberMe = false]) async {
    try {} catch (e) {
      log.info(e.toString());
    }
    /* var body = jsonEncode({
      "username": _username,
      "password": _password,
      "rememberMe": _rememberMe
    });
    var data = await RestServices.post('authenticate', body);
    if (data.runtimeType.toString() ==
        '_InternalLinkedHashMap<String, dynamic>') {
      String _token = data['id_token'];
      db.saveToken(_token);
      return "SUCCESS";
    } else {
      return data;
    } 
    */

    for (var user in await userStatic()) {
      if (user.username == username && user.password == password) {
        //return await db.insertObject({"user":user.id});
        // return 'SUCCESS';
      }
    }
    return 0;
    //return 'unauthorized';
  }

  static signIn() async {
    return await RestServices.post('authenticate', 'body');
  }

  static userStatic() async {
    return User.listFromJson(
        json.decode(await rootBundle.loadString('assets/data/users.json')));
  }

  static fetchToken() async {
    String token = ''; //await dbs.fetchToken();
    return token;
  }

  static void logout() {
    log.severe('logout');
    //  db.deleteToken();
  }

  /// changePassword
  static changePassword(String currentPassword, String newPassword) async {
    var body =
        '{"currentPassword": "$currentPassword","newPassword": "$newPassword"}';
    await RestServices.post('account/change-password', body);
  }

  /// Get getAuthorities
  static authorities() async {
    return await RestServices.fetch('users/authorities');
  }

  /// Path activate
  /// GET activateAccount
  static activate(String key) async {
    var body = " ?key=";
    await RestServices.post('activate?key=$key', body);
  }

  /// Path account/reset-password/finish
  /// POST finishPasswordReset
  static resetPasswordFinish(String key, String newPassword) async {
    var body = '{"key": "$key","newPassword": "$newPassword"}';
    await RestServices.post('account/reset-password/finish', body);
  }

  /// Path account/reset-password/init
  /// POST requestPasswordReset
  static resetPasswordInit(String email) async {
    await RestServices.post('account/reset-password/init', email);
  }
}
