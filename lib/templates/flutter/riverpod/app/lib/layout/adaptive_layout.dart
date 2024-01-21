// Copyright 2020, the Golok project authors. Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

import 'package:adaptive_screen/adaptive_screen.dart';
import 'package:flutter/material.dart';

import '../models/menu.dart';
import 'large_screen.dart';
import 'medium_screen.dart';
import 'phone_screen.dart';


class AdaptiveLayout extends StatefulWidget {
  final Widget? title;
  final List<Widget> actions;
  final Widget? body;
  final int currentIndex;
  final List<Menu> menuItems;
  final ValueChanged<int>? onBottomTap;
  final ValueChanged<int>? onFoldMenuTap;
  final ValueChanged<Menu>? onMenuClick;
  final FloatingActionButton? floatingActionButton;

  const AdaptiveLayout({
    this.title,
    this.body,
    this.actions = const [],
    required this.currentIndex,
    required this.menuItems,
    this.onMenuClick,
    this.floatingActionButton,
    super.key,
    this.onBottomTap,
    this.onFoldMenuTap,
  });

  @override
  State<AdaptiveLayout> createState() => _AdaptiveLayoutState();
}

class _AdaptiveLayoutState extends State<AdaptiveLayout> {
  @override
  Widget build(BuildContext context) => AdaptiveScreen(
      // If fit large screen (Desktop)
      largeScreen: LargeScreen(
        title: widget.title,
        body: widget.body,
        currentIndex: widget.currentIndex,
        menuItems: widget.menuItems,
        actions: widget.actions,
        onBottomTap: widget.onBottomTap,
        onFoldMenuTap: widget.onFoldMenuTap,
        onMenuClick: widget.onMenuClick,
        floatingActionButton: widget.floatingActionButton,
      ),

      // If fit medium screen (Tablet)
      mediumScreen: MediumScreen(
        title: widget.title,
        body: widget.body,
        currentIndex: widget.currentIndex,
        menuItems: widget.menuItems,
        actions: widget.actions,
        onBottomTap: widget.onBottomTap,
        onFoldMenuTap: widget.onFoldMenuTap,
        onMenuClick: widget.onMenuClick,
        floatingActionButton: widget.floatingActionButton,
      ),

      // If fit small screen (Phone)
      phone: PhoneScreen(
        body: widget.body,
        title: widget.title,
        actions: widget.actions,
        currentIndex: widget.currentIndex,
        onBottomTap: widget.onBottomTap,
        floatingActionButton: widget.floatingActionButton,
        menuItems: widget.menuItems,
      ));
}
