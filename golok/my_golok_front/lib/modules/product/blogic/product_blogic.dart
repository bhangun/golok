import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/product_routes.dart';
import '../services/product_services.dart';
import '../models/product.dart';


final productBloc = ChangeNotifierProvider<ProductBloc>((ref) => ProductBloc());

class ProductBloc extends ChangeNotifier {
  
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

  Product? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update Product':'Create Product'; 
  
  void setDouble(double value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void setString(String value) {
     = value;
  }
  
  void setString(String value) {
     = value;
  }
  
  void setInt(int value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void set( value) {
     = value;
  }
  
  void set( value) {
     = value;
  }

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = productList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(ProductRoutes.productDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(ProductRoutes.productForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? ProductServices.updateProduct(_toProduct())
          :ProductServices.createProduct(_toProduct());
      NavigationServices.navigateTo(ProductRoutes.productList);
      loading = false;
      success = true;
      getProductList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      ProductServices.deleteProduct(id);
      isDeleted =true;
      loading = false;
      success = true;
      getProductList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(ProductRoutes.productForm);
      isUpdated = true;
      loading = false;
      success = true;
      getProductList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getProductList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      ProductServices.products().then((data) => _setProductList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setProductList(List<Product> data){
    if (data != null) {
      productList = data;
      totalItem = data.length;
    }
  }

  Product _toProduct() {
    return Product(
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , );
  }

  
  viewList() {
    getProductList();
    NavigationServices.navigateTo(ProductRoutes.productList);
  }
}
