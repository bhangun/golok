import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../app/app_module.dart';
import '../core/modules/menu.dart';
import 'package:golok/modules/pub_info/pub_info_module.dart'; 
import 'package:golok/modules/publishers/publishers_module.dart'; 
import 'package:golok/modules/employee/employee_module.dart'; 
import 'package:golok/modules/jobs/jobs_module.dart'; 
import 'package:golok/modules/stores/stores_module.dart'; 
import 'package:golok/modules/discounts/discounts_module.dart'; 
import 'package:golok/modules/sales/sales_module.dart'; 
import 'package:golok/modules/titles/titles_module.dart'; 
import 'package:golok/modules/titleauthor/titleauthor_module.dart'; 
import 'package:golok/modules/roysched/roysched_module.dart'; 

List<Menu> registerPages(BuildContext context){
  return [
    ...AppModule().pages(context),
    ...PubInfoModule().pages(context),  
    ...PublishersModule().pages(context),  
    ...EmployeeModule().pages(context),  
    ...JobsModule().pages(context),  
    ...StoresModule().pages(context),  
    ...DiscountsModule().pages(context),  
    ...SalesModule().pages(context),  
    ...TitlesModule().pages(context),  
    ...TitleauthorModule().pages(context),  
    ...RoyschedModule().pages(context),  
  ];
}

List<List<GoRoute>> modulesGoroutes()=>[
  AppModule().goroutes(),
  PubInfoModule().goroutes(),  
  PublishersModule().goroutes(),  
  EmployeeModule().goroutes(),  
  JobsModule().goroutes(),  
  StoresModule().goroutes(),  
  DiscountsModule().goroutes(),  
  SalesModule().goroutes(),  
  TitlesModule().goroutes(),  
  TitleauthorModule().goroutes(),  
  RoyschedModule().goroutes(),  
];

List<List<StatefulShellBranch>> modulesBranches(){
  return [
    AppModule().branches(),
    PubInfoModule().branches(),  
    PublishersModule().branches(),  
    EmployeeModule().branches(),  
    JobsModule().branches(),  
    StoresModule().branches(),  
    DiscountsModule().branches(),  
    SalesModule().branches(),  
    TitlesModule().branches(),  
    TitleauthorModule().branches(),  
    RoyschedModule().branches(),      
  ];
}