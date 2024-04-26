import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/order_routes.dart';
import '../services/order_services.dart';
import '../models/order.dart';


final orderBloc = ChangeNotifierProvider<OrderBloc>((ref) => OrderBloc());

class OrderBloc extends ChangeNotifier {
  
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

  Order? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update Order':'Create Order'; 
  
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
  
  void set( value) {
     = value;
  }
  
  void setInt(int value) {
     = value;
  }
  
  void setDouble(double value) {
     = value;
  }

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = orderList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(OrderRoutes.orderDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(OrderRoutes.orderForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? OrderServices.updateOrder(_toOrder())
          :OrderServices.createOrder(_toOrder());
      NavigationServices.navigateTo(OrderRoutes.orderList);
      loading = false;
      success = true;
      getOrderList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      OrderServices.deleteOrder(id);
      isDeleted =true;
      loading = false;
      success = true;
      getOrderList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(OrderRoutes.orderForm);
      isUpdated = true;
      loading = false;
      success = true;
      getOrderList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getOrderList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      OrderServices.orders().then((data) => _setOrderList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setOrderList(List<Order> data){
    if (data != null) {
      orderList = data;
      totalItem = data.length;
    }
  }

  Order _toOrder() {
    return Order(
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
    getOrderList();
    NavigationServices.navigateTo(OrderRoutes.orderList);
  }
}
