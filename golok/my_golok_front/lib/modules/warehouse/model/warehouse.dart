import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class Warehouse extends Equatable{
    final double? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 

    const Warehouse({  
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
    });

    factory Warehouse.fromJson(Map<String, dynamic> json) =>  
        Warehouse(: json[''], 
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
        
    };

    static List<Warehouse> listFromString(String str) => List<Warehouse>.from(json.decode(str).map((x) => Warehouse.fromJson(x)));

    static List<Warehouse> listFromJson(List<dynamic> data) {
        return data.map((post) => Warehouse.fromJson(post)).toList();
    }

    static String listWarehouseToJson(List<Warehouse> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

    @override
    List<Object> get props => [
        !, 
        !, 
        !, 
        !, 
        !, 
        !, 
        !, 
    ];
}

class WarehouseList {
  final List<Warehouse>? warehouses;

  WarehouseList({
    this.warehouses,
  });

  factory WarehouseList.fromJson(List<dynamic> json) {
    List<Warehouse> warehouses = [];
    warehouses = json.map((post) => Warehouse.fromJson(post)).toList();

    return WarehouseList(
      warehouses: warehouses,
    );
  }
}


