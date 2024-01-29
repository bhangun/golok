import 'dart:async';

import 'package:flutter/material.dart';

import '../main_routes.dart';
import '../../../utils/configuration/config.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  static Route route() {
    return MaterialPageRoute<void>(builder: (_) => const SplashScreen());
  }

  @override
  State<StatefulWidget> createState() => _Splashpagestate();
}

class _Splashpagestate extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    startTimer();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Center(child: Image.asset(imageSplash)),
    );
  }

  startTimer() {
    var duration = const Duration(milliseconds: 300);
    return Timer(duration, navigate);
  }

  navigate() async {
    Navigator.of(context).pushReplacementNamed(MainRoutes.login);
  }
}
