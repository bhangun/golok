import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/price_routes.dart';
import '../services/price_services.dart';
import '../models/price.dart';


final priceBloc = ChangeNotifierProvider<PriceBloc>((ref) => PriceBloc());

class PriceBloc extends ChangeNotifier {
  
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

  Price? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update Price':'Create Price'; 
  
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
  
  void setDouble(double value) {
     = value;
  }

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = priceList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(PriceRoutes.priceDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(PriceRoutes.priceForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? PriceServices.updatePrice(_toPrice())
          :PriceServices.createPrice(_toPrice());
      NavigationServices.navigateTo(PriceRoutes.priceList);
      loading = false;
      success = true;
      getPriceList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      PriceServices.deletePrice(id);
      isDeleted =true;
      loading = false;
      success = true;
      getPriceList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(PriceRoutes.priceForm);
      isUpdated = true;
      loading = false;
      success = true;
      getPriceList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getPriceList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      PriceServices.prices().then((data) => _setPriceList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setPriceList(List<Price> data){
    if (data != null) {
      priceList = data;
      totalItem = data.length;
    }
  }

  Price _toPrice() {
    return Price(
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , );
  }

  
  viewList() {
    getPriceList();
    NavigationServices.navigateTo(PriceRoutes.priceList);
  }
}
