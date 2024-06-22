import 'package:adaptive_screen/index.dart';
import 'package:flutter/material.dart';

import '../../dashboard/pages/dashboard.dart';
import 'home_phone.dart';


class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const AdaptiveScreen(
      largeScreen: DashboardPage(),
      mediumScreen: DashboardPage(),
      phone: HomePhonePage(),
    );
  }
}