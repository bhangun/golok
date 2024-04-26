import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class Order extends Equatable{
    final double? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final int? ; 
    final double? ; 

    const Order({  
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

    factory Order.fromJson(Map<String, dynamic> json) =>  
        Order(: json[''], 
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
        
    };

    static List<Order> listFromString(String str) => List<Order>.from(json.decode(str).map((x) => Order.fromJson(x)));

    static List<Order> listFromJson(List<dynamic> data) {
        return data.map((post) => Order.fromJson(post)).toList();
    }

    static String listOrderToJson(List<Order> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

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
    ];
}

class OrderList {
  final List<Order>? orders;

  OrderList({
    this.orders,
  });

  factory OrderList.fromJson(List<dynamic> json) {
    List<Order> orders = [];
    orders = json.map((post) => Order.fromJson(post)).toList();

    return OrderList(
      orders: orders,
    );
  }
}


