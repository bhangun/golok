import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/category_routes.dart';
import '../services/category_services.dart';
import '../models/category.dart';


final categoryBloc = ChangeNotifierProvider<CategoryBloc>((ref) => CategoryBloc());

class CategoryBloc extends ChangeNotifier {
  
  bool isListEmpty = true;
  
  bool isItemEmpty = true;
  
  bool isUpdated = false;
  
  bool isDeleted = false;

  
  String errorMessage='error';
  
  bool showError = false;
  
  String title = '';

  
  int totalItem = 0;
  
  bool success = false;
  
  bool loading = false;

  int position = 0;

  Category? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update Category':'Create Category'; 

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = categoryList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(CategoryRoutes.categoryDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(CategoryRoutes.categoryForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? CategoryServices.updateCategory(_toCategory())
          :CategoryServices.createCategory(_toCategory());
      NavigationServices.navigateTo(CategoryRoutes.categoryList);
      loading = false;
      success = true;
      getCategoryList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      CategoryServices.deleteCategory(id);
      isDeleted =true;
      loading = false;
      success = true;
      getCategoryList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(CategoryRoutes.categoryForm);
      isUpdated = true;
      loading = false;
      success = true;
      getCategoryList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getCategoryList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      CategoryServices.categorys().then((data) => _setCategoryList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setCategoryList(List<Category> data){
    if (data != null) {
      categoryList = data;
      totalItem = data.length;
    }
  }

  Category _toCategory() {
    return Category();
  }

  
  viewList() {
    getCategoryList();
    NavigationServices.navigateTo(CategoryRoutes.categoryList);
  }
}
