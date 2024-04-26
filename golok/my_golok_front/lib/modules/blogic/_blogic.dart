import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/_routes.dart';
import '../services/_services.dart';
import '../models/.dart';


final Bloc = ChangeNotifierProvider<Bloc>((ref) => Bloc());

class Bloc extends ChangeNotifier {
  
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

  ? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update ':'Create '; 

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = List![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(Routes.Detail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(Routes.Form);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? Services.update(_to())
          :Services.create(_to());
      NavigationServices.navigateTo(Routes.List);
      loading = false;
      success = true;
      getList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      Services.delete(id);
      isDeleted =true;
      loading = false;
      success = true;
      getList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(Routes.Form);
      isUpdated = true;
      loading = false;
      success = true;
      getList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      Services.s().then((data) => _setList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setList(List<> data){
    if (data != null) {
      List = data;
      totalItem = data.length;
    }
  }

   _to() {
    return ();
  }

  
  viewList() {
    getList();
    NavigationServices.navigateTo(Routes.List);
  }
}
