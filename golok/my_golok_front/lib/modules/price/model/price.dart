import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class Price extends Equatable{
    final double? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final double? ; 

    const Price({  
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
    });

    factory Price.fromJson(Map<String, dynamic> json) =>  
        Price(: json[''], 
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

    static List<Price> listFromString(String str) => List<Price>.from(json.decode(str).map((x) => Price.fromJson(x)));

    static List<Price> listFromJson(List<dynamic> data) {
        return data.map((post) => Price.fromJson(post)).toList();
    }

    static String listPriceToJson(List<Price> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

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

class PriceList {
  final List<Price>? prices;

  PriceList({
    this.prices,
  });

  factory PriceList.fromJson(List<dynamic> json) {
    List<Price> prices = [];
    prices = json.map((post) => Price.fromJson(post)).toList();

    return PriceList(
      prices: prices,
    );
  }
}


