import 'dart:async';
import 'dart:convert';

import '../model/inventory.dart';
import '../../../services/rest/rest_services.dart';


class InventoryServices {

  static Future<Inventory> inventory(String id) async {
    var response = await RestServices.fetch('/api/inventory$id');
    return Inventory.fromJson(json.decode(response));
  }

  static Future<List<Inventory>> inventorys([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/inventorys');
    return Inventory.listFromString(data);
  }

  static createInventory(Inventory inventory) async {
    
  }

  //
  static updateInventory(Inventory inventory) async {
    
  }

  //
  static deleteInventory(int id) async {
    
  }

}