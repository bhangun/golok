import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class Invoice extends Equatable{
    final double? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 

    const Invoice({  
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
    });

    factory Invoice.fromJson(Map<String, dynamic> json) =>  
        Invoice(: json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
        
    );

    Map<String, dynamic> toJson() => 
        {"": ,
        "": ,
        "": ,
        "": ,
        "": ,
        "": ,
        "": ,
        "": ,
        
    };

    static List<Invoice> listFromString(String str) => List<Invoice>.from(json.decode(str).map((x) => Invoice.fromJson(x)));

    static List<Invoice> listFromJson(List<dynamic> data) {
        return data.map((post) => Invoice.fromJson(post)).toList();
    }

    static String listInvoiceToJson(List<Invoice> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

    @override
    List<Object> get props => [
        !, 
        !, 
        !, 
        !, 
        !, 
        !, 
        !, 
        !, 
    ];
}

class InvoiceList {
  final List<Invoice>? invoices;

  InvoiceList({
    this.invoices,
  });

  factory InvoiceList.fromJson(List<dynamic> json) {
    List<Invoice> invoices = [];
    invoices = json.map((post) => Invoice.fromJson(post)).toList();

    return InvoiceList(
      invoices: invoices,
    );
  }
}


