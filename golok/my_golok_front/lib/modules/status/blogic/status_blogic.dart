import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/status_routes.dart';
import '../services/status_services.dart';
import '../models/status.dart';


final statusBloc = ChangeNotifierProvider<StatusBloc>((ref) => StatusBloc());

class StatusBloc extends ChangeNotifier {
  
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

  Status? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update Status':'Create Status'; 
  
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
      itemDetail = statusList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(StatusRoutes.statusDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(StatusRoutes.statusForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? StatusServices.updateStatus(_toStatus())
          :StatusServices.createStatus(_toStatus());
      NavigationServices.navigateTo(StatusRoutes.statusList);
      loading = false;
      success = true;
      getStatusList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      StatusServices.deleteStatus(id);
      isDeleted =true;
      loading = false;
      success = true;
      getStatusList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(StatusRoutes.statusForm);
      isUpdated = true;
      loading = false;
      success = true;
      getStatusList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getStatusList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      StatusServices.statuss().then((data) => _setStatusList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setStatusList(List<Status> data){
    if (data != null) {
      statusList = data;
      totalItem = data.length;
    }
  }

  Status _toStatus() {
    return Status(
    : , 
    : , 
    : , 
    : , 
    : , 
    : , 
    : , );
  }

  
  viewList() {
    getStatusList();
    NavigationServices.navigateTo(StatusRoutes.statusList);
  }
}
