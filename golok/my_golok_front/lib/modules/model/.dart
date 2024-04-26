import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class  extends Equatable{

    const ();

    factory .fromJson(Map<String, dynamic> json) =>  
        (
    );

    Map<String, dynamic> toJson() => 
        {
    };

    static List<> listFromString(String str) => List<>.from(json.decode(str).map((x) => .fromJson(x)));

    static List<> listFromJson(List<dynamic> data) {
        return data.map((post) => .fromJson(post)).toList();
    }

    static String listToJson(List<> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

    @override
    List<Object> get props => [
    ];
}

class List {
  final List<>? s;

  List({
    this.s,
  });

  factory List.fromJson(List<dynamic> json) {
    List<> s = [];
    s = json.map((post) => .fromJson(post)).toList();

    return List(
      s: s,
    );
  }
}


