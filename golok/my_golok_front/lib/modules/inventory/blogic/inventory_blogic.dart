import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/inventory_routes.dart';
import '../services/inventory_services.dart';
import '../models/inventory.dart';


final inventoryBloc = ChangeNotifierProvider<InventoryBloc>((ref) => InventoryBloc());

class InventoryBloc extends ChangeNotifier {
  
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

  Inventory? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update Inventory':'Create Inventory'; 
  
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
  
  void setInt(int value) {
     = value;
  }
  
  void setInt(int value) {
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
  
  void setDateTime(DateTime value) {
     = value;
  }
  
  void set( value) {
     = value;
  }

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = inventoryList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(InventoryRoutes.inventoryDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(InventoryRoutes.inventoryForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? InventoryServices.updateInventory(_toInventory())
          :InventoryServices.createInventory(_toInventory());
      NavigationServices.navigateTo(InventoryRoutes.inventoryList);
      loading = false;
      success = true;
      getInventoryList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      InventoryServices.deleteInventory(id);
      isDeleted =true;
      loading = false;
      success = true;
      getInventoryList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(InventoryRoutes.inventoryForm);
      isUpdated = true;
      loading = false;
      success = true;
      getInventoryList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getInventoryList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      InventoryServices.inventorys().then((data) => _setInventoryList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setInventoryList(List<Inventory> data){
    if (data != null) {
      inventoryList = data;
      totalItem = data.length;
    }
  }

  Inventory _toInventory() {
    return Inventory(
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
    getInventoryList();
    NavigationServices.navigateTo(InventoryRoutes.inventoryList);
  }
}
