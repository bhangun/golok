import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class User extends Equatable{
    final double? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 
    final ? ; 

    const User({  
        this., 
        this., 
        this., 
        this., 
        this., 
        this., 
    });

    factory User.fromJson(Map<String, dynamic> json) =>  
        User(: json[''], 
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
        
    };

    static List<User> listFromString(String str) => List<User>.from(json.decode(str).map((x) => User.fromJson(x)));

    static List<User> listFromJson(List<dynamic> data) {
        return data.map((post) => User.fromJson(post)).toList();
    }

    static String listUserToJson(List<User> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

    @override
    List<Object> get props => [
        !, 
        !, 
        !, 
        !, 
        !, 
        !, 
    ];
}

class UserList {
  final List<User>? users;

  UserList({
    this.users,
  });

  factory UserList.fromJson(List<dynamic> json) {
    List<User> users = [];
    users = json.map((post) => User.fromJson(post)).toList();

    return UserList(
      users: users,
    );
  }
}


