import 'dart:async';
import 'dart:convert';

import '../model/category.dart';
import '../../../services/rest/rest_services.dart';


class CategoryServices {

  static Future<Category> category(String id) async {
    var response = await RestServices.fetch('/api/category$id');
    return Category.fromJson(json.decode(response));
  }

  static Future<List<Category>> categorys([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/categorys');
    return Category.listFromString(data);
  }

  static createCategory(Category category) async {
    
  }

  //
  static updateCategory(Category category) async {
    
  }

  //
  static deleteCategory(int id) async {
    
  }

}