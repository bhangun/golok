import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HomePhonePage extends ConsumerStatefulWidget {
  const HomePhonePage({super.key});

  @override
  ConsumerState<HomePhonePage> createState() => _HomePhonePageState();
}

class _HomePhonePageState extends ConsumerState<HomePhonePage> {
  int? currentIndex = 0;
  int selctedNavIndex = 0;
  Color bottonNavBgColor = Colors.red;
  var bottomNavItems = [];
  var valueCart = 0;
  var valueNotif = 0;

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Expanded(child: 
        SingleChildScrollView(
            child: 
            Column(
          children: [
            
          ],
        ))),
        
      ],
    );
  }
}
