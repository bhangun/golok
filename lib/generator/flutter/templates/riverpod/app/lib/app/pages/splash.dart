import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/utils/config.dart';
import '../app_module.dart';


class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

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
    context.go(AppModule.login);
  }
}
