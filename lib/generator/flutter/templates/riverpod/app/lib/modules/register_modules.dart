import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/menu.dart';
import 'main/main_module.dart';


List<Menu> registerPages(BuildContext context){
  return [
    ...MainModule().pages(context),
    //...UserModule().pages(context),
  ];
}

List<List<GoRoute>> modulesGoroutes()=>[
  MainModule().goroutes(),
];

List<List<StatefulShellBranch>> modulesBranches(){
  return [
    MainModule().branches(),    
  ];
}