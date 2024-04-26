import 'dart:async';
import 'dart:convert';

import '../model/invoice.dart';
import '../../../services/rest/rest_services.dart';


class InvoiceServices {

  static Future<Invoice> invoice(String id) async {
    var response = await RestServices.fetch('/api/invoice$id');
    return Invoice.fromJson(json.decode(response));
  }

  static Future<List<Invoice>> invoices([var page, var size, var sort]) async {
    var data = await RestServices.fetch('/api/invoices');
    return Invoice.listFromString(data);
  }

  static createInvoice(Invoice invoice) async {
    
  }

  //
  static updateInvoice(Invoice invoice) async {
    
  }

  //
  static deleteInvoice(int id) async {
    
  }

}