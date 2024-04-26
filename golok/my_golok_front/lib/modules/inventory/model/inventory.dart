import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class Inventory extends Equatable{
    final double? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final int? ; 
    final int? ; 
    final int? ; 
    final ? ; 
    final ? ; 
    final DateTime? ; 
    final ? ; 

    const Inventory({  
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

    factory Inventory.fromJson(Map<String, dynamic> json) =>  
        Inventory(: json[''], 
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
        
    };

    static List<Inventory> listFromString(String str) => List<Inventory>.from(json.decode(str).map((x) => Inventory.fromJson(x)));

    static List<Inventory> listFromJson(List<dynamic> data) {
        return data.map((post) => Inventory.fromJson(post)).toList();
    }

    static String listInventoryToJson(List<Inventory> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

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
    ];
}

class InventoryList {
  final List<Inventory>? inventorys;

  InventoryList({
    this.inventorys,
  });

  factory InventoryList.fromJson(List<dynamic> json) {
    List<Inventory> inventorys = [];
    inventorys = json.map((post) => Inventory.fromJson(post)).toList();

    return InventoryList(
      inventorys: inventorys,
    );
  }
}


