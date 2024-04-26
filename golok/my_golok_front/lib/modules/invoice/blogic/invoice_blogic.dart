import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/invoice_routes.dart';
import '../services/invoice_services.dart';
import '../models/invoice.dart';


final invoiceBloc = ChangeNotifierProvider<InvoiceBloc>((ref) => InvoiceBloc());

class InvoiceBloc extends ChangeNotifier {
  
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

  Invoice? itemDetail;
    

  // actions:-------------------------------------------------------------------

  String get formTitle => isUpdated? title='Update Invoice':'Create Invoice'; 
  
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
  
  void set( value) {
     = value;
  }

  
  itemTap(int _position) {
    try {
      position = _position;
      itemDetail = invoiceList![position];
      isItemEmpty = false;
      NavigationServices.navigateTo(InvoiceRoutes.invoiceDetail);

    } catch (e) {
      isItemEmpty = true;
    }
  }

  
  add() {
    itemDetail = null;
    isUpdated = false;
    NavigationServices.navigateTo(InvoiceRoutes.invoiceForm);
  }

  
  save() {
    loading = true;
    success = false;
    try {
      isUpdated ? InvoiceServices.updateInvoice(_toInvoice())
          :InvoiceServices.createInvoice(_toInvoice());
      NavigationServices.navigateTo(InvoiceRoutes.invoiceList);
      loading = false;
      success = true;
      getInvoiceList();
    }catch(e){
      print(e.toString());
    }
  }

  
  delete(int id) {
    loading = true;
    success = false;
    try {
      InvoiceServices.deleteInvoice(id);
      isDeleted =true;
      loading = false;
      success = true;
      getInvoiceList();
    }catch(e){
      print(e.toString());
    }
  }

  
  update() {
    loading = true;
    success = false;
    try {
      NavigationServices.navigateTo(InvoiceRoutes.invoiceForm);
      isUpdated = true;
      loading = false;
      success = true;
      getInvoiceList();
    }catch(e){
      print(e.toString());
    }
  }

  Future getInvoiceList() async {
    loading = true;
    success = false;
    isListEmpty = true;
    try {
      InvoiceServices.invoices().then((data) => _setInvoiceList(data));
      isListEmpty = false;
      loading = false;
      success = true;
    } catch (e) {
      showError = true;
      errorMessage = 'Data Empty';
      print(e.toString());
    }

  }

  _setInvoiceList(List<Invoice> data){
    if (data != null) {
      invoiceList = data;
      totalItem = data.length;
    }
  }

  Invoice _toInvoice() {
    return Invoice(
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
    getInvoiceList();
    NavigationServices.navigateTo(InvoiceRoutes.invoiceList);
  }
}
