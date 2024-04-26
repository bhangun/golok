import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class Product extends Equatable{
    final double? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final String? ; 
    final String? ; 
    final int? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 

    const Product({  
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
    });

    factory Product.fromJson(Map<String, dynamic> json) =>  
        Product(: json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
        : json[''], 
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
        "": ,
        "": ,
        "": ,
        "": ,
        "": ,
        "": ,
        
    };

    static List<Product> listFromString(String str) => List<Product>.from(json.decode(str).map((x) => Product.fromJson(x)));

    static List<Product> listFromJson(List<dynamic> data) {
        return data.map((post) => Product.fromJson(post)).toList();
    }

    static String listProductToJson(List<Product> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

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
        !, 
        !, 
        !, 
        !, 
        !, 
        !, 
    ];
}

class ProductList {
  final List<Product>? products;

  ProductList({
    this.products,
  });

  factory ProductList.fromJson(List<dynamic> json) {
    List<Product> products = [];
    products = json.map((post) => Product.fromJson(post)).toList();

    return ProductList(
      products: products,
    );
  }
}


