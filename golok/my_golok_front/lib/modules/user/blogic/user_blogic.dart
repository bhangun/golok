import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/user_routes.dart';
import '../services/user_services.dart';
import '../models/user.dart';


final userBloc = ChangeNotifierProvider<UserBloc>((ref) => UserBloc());

class UserBloc extends ChangeNotifier {
  
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

  User? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update User':'Create User'; 
  
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

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = userList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(UserRoutes.userDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(UserRoutes.userForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? UserServices.updateUser(_toUser())
          :UserServices.createUser(_toUser());
      NavigationServices.navigateTo(UserRoutes.userList);
      loading = false;
      success = true;
      getUserList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      UserServices.deleteUser(id);
      isDeleted =true;
      loading = false;
      success = true;
      getUserList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(UserRoutes.userForm);
      isUpdated = true;
      loading = false;
      success = true;
      getUserList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getUserList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      UserServices.users().then((data) => _setUserList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setUserList(List<User> data){
    if (data != null) {
      userList = data;
      totalItem = data.length;
    }
  }

  User _toUser() {
    return User(
    : , 
    : , 
    : , 
    : , 
    : , 
    : , );
  }

  
  viewList() {
    getUserList();
    NavigationServices.navigateTo(UserRoutes.userList);
  }
}
