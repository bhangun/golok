import 'package:flutter/material.dart';

TextTheme createTextTheme(
    BuildContext context, String bodyFontString, String displayFontString) {
  //TextTheme baseTextTheme = Theme.of(context).textTheme;
  TextTheme bodyTextTheme = const TextTheme(displaySmall:  TextStyle(fontFamily: 'RobotoCondensed'));
  TextTheme displayTextTheme = const TextTheme(displaySmall:  TextStyle(fontFamily: 'RobotoFlex'));
  TextTheme textTheme = displayTextTheme.copyWith(
    bodyLarge: bodyTextTheme.bodyLarge,
    bodyMedium: bodyTextTheme.bodyMedium,
    bodySmall: bodyTextTheme.bodySmall,
    labelLarge: bodyTextTheme.labelLarge,
    labelMedium: bodyTextTheme.labelMedium,
    labelSmall: bodyTextTheme.labelSmall,
  );
  return textTheme;
}
