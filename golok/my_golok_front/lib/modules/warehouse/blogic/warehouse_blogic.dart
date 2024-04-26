import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/warehouse_routes.dart';
import '../services/warehouse_services.dart';
import '../models/warehouse.dart';


final warehouseBloc = ChangeNotifierProvider<WarehouseBloc>((ref) => WarehouseBloc());

class WarehouseBloc extends ChangeNotifier {
  
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

  Warehouse? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update Warehouse':'Create Warehouse'; 
  
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

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = warehouseList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(WarehouseRoutes.warehouseDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(WarehouseRoutes.warehouseForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? WarehouseServices.updateWarehouse(_toWarehouse())
          :WarehouseServices.createWarehouse(_toWarehouse());
      NavigationServices.navigateTo(WarehouseRoutes.warehouseList);
      loading = false;
      success = true;
      getWarehouseList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      WarehouseServices.deleteWarehouse(id);
      isDeleted =true;
      loading = false;
      success = true;
      getWarehouseList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(WarehouseRoutes.warehouseForm);
      isUpdated = true;
      loading = false;
      success = true;
      getWarehouseList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getWarehouseList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      WarehouseServices.warehouses().then((data) => _setWarehouseList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setWarehouseList(List<Warehouse> data){
    if (data != null) {
      warehouseList = data;
      totalItem = data.length;
    }
  }

  Warehouse _toWarehouse() {
    return Warehouse(
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , );
  }

  
  viewList() {
    getWarehouseList();
    NavigationServices.navigateTo(WarehouseRoutes.warehouseList);
  }
}
