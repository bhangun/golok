import 'dart:async';
import 'dart:convert';

import '../model/price.dart';
import '../../../services/rest/rest_services.dart';


class PriceServices {

  static Future<Price> price(String id) async {
    var response = await RestServices.fetch('/api/price$id');
    return Price.fromJson(json.decode(response));
  }

  static Future<List<Price>> prices([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/prices');
    return Price.listFromString(data);
  }

  static createPrice(Price price) async {
    
  }

  //
  static updatePrice(Price price) async {
    
  }

  //
  static deletePrice(int id) async {
    
  }

}