import 'dart:async';
import 'dart:convert';

import '../model/order.dart';
import '../../../services/rest/rest_services.dart';


class OrderServices {

  static Future<Order> order(String id) async {
    var response = await RestServices.fetch('/api/order$id');
    return Order.fromJson(json.decode(response));
  }

  static Future<List<Order>> orders([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/orders');
    return Order.listFromString(data);
  }

  static createOrder(Order order) async {
    
  }

  //
  static updateOrder(Order order) async {
    
  }

  //
  static deleteOrder(int id) async {
    
  }

}