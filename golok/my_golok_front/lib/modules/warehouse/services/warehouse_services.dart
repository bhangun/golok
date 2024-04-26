import 'dart:async';
import 'dart:convert';

import '../model/warehouse.dart';
import '../../../services/rest/rest_services.dart';


class WarehouseServices {

  static Future<Warehouse> warehouse(String id) async {
    var response = await RestServices.fetch('/api/warehouse$id');
    return Warehouse.fromJson(json.decode(response));
  }

  static Future<List<Warehouse>> warehouses([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/warehouses');
    return Warehouse.listFromString(data);
  }

  static createWarehouse(Warehouse warehouse) async {
    
  }

  //
  static updateWarehouse(Warehouse warehouse) async {
    
  }

  //
  static deleteWarehouse(int id) async {
    
  }

}