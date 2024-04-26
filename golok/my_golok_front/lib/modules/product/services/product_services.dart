import 'dart:async';
import 'dart:convert';

import '../model/product.dart';
import '../../../services/rest/rest_services.dart';


class ProductServices {

  static Future<Product> product(String id) async {
    var response = await RestServices.fetch('/api/product$id');
    return Product.fromJson(json.decode(response));
  }

  static Future<List<Product>> products([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/products');
    return Product.listFromString(data);
  }

  static createProduct(Product product) async {
    
  }

  //
  static updateProduct(Product product) async {
    
  }

  //
  static deleteProduct(int id) async {
    
  }

}