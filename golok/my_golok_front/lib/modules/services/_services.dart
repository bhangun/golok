import 'dart:async';
import 'dart:convert';

import '../model/.dart';
import '../../../services/rest/rest_services.dart';


class Services {

  static Future<> (String id) async {
    var response = await RestServices.fetch('/api/$id');
    return .fromJson(json.decode(response));
  }

  static Future<List<>> s([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/s');
    return .listFromString(data);
  }

  static create( ) async {
    
  }

  //
  static update( ) async {
    
  }

  //
  static delete(int id) async {
    
  }

}