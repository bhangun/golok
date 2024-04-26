import 'dart:async';
import 'dart:convert';

import '../model/status.dart';
import '../../../services/rest/rest_services.dart';


class StatusServices {

  static Future<Status> status(String id) async {
    var response = await RestServices.fetch('/api/status$id');
    return Status.fromJson(json.decode(response));
  }

  static Future<List<Status>> statuss([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/statuss');
    return Status.listFromString(data);
  }

  static createStatus(Status status) async {
    
  }

  //
  static updateStatus(Status status) async {
    
  }

  //
  static deleteStatus(int id) async {
    
  }

}