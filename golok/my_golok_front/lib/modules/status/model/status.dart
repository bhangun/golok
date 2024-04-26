import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class Status extends Equatable{
    final double? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 

    const Status({  
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
    });

    factory Status.fromJson(Map<String, dynamic> json) =>  
        Status(: json[''], 
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

    static List<Status> listFromString(String str) => List<Status>.from(json.decode(str).map((x) => Status.fromJson(x)));

    static List<Status> listFromJson(List<dynamic> data) {
        return data.map((post) => Status.fromJson(post)).toList();
    }

    static String listStatusToJson(List<Status> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

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

class StatusList {
  final List<Status>? statuss;

  StatusList({
    this.statuss,
  });

  factory StatusList.fromJson(List<dynamic> json) {
    List<Status> statuss = [];
    statuss = json.map((post) => Status.fromJson(post)).toList();

    return StatusList(
      statuss: statuss,
    );
  }
}


