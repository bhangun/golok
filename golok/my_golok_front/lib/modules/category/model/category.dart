import 'dart:convert';
import 'package:equatable/equatable.dart'; 

class Category extends Equatable{

    const Category();

    factory Category.fromJson(Map<String, dynamic> json) =>  
        Category(
    );

    Map<String, dynamic> toJson() => 
        {
    };

    static List<Category> listFromString(String str) => List<Category>.from(json.decode(str).map((x) => Category.fromJson(x)));

    static List<Category> listFromJson(List<dynamic> data) {
        return data.map((post) => Category.fromJson(post)).toList();
    }

    static String listCategoryToJson(List<Category> data) => json.encode(List<dynamic>.from(data.map((x) => x.toJson())));

    @override
    List<Object> get props => [
    ];
}

class CategoryList {
  final List<Category>? categorys;

  CategoryList({
    this.categorys,
  });

  factory CategoryList.fromJson(List<dynamic> json) {
    List<Category> categorys = [];
    categorys = json.map((post) => Category.fromJson(post)).toList();

    return CategoryList(
      categorys: categorys,
    );
  }
}


