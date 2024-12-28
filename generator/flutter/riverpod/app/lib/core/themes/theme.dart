import "package:flutter/material.dart";

class MaterialTheme {
  final TextTheme textTheme;

  const MaterialTheme(this.textTheme);

  static MaterialScheme lightScheme() {
    return const MaterialScheme(
      brightness: Brightness.light,
      primary: Color.fromARGB(255, 15, 170, 231),
      surfaceTint: Color.fromARGB(255, 17, 141, 190),
      onPrimary: Color(0xffffffff), //
      primaryContainer: Color(0xffc1e8ff),
      onPrimaryContainer: Color(0xff001e2b),
      secondary: Color(0xff4d616c),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xffd0e6f3),
      onSecondaryContainer: Color(0xff091e27),
      tertiary: Color(0xff5f5a7d),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xffe5deff),
      onTertiaryContainer: Color(0xff1b1736),
      error: Color(0xffba1a1a),
      onError: Color(0xffffffff),
      errorContainer: Color(0xffffdad6),
      onErrorContainer: Color(0xff410002),
      background: Color.fromARGB(255, 124, 231, 240), // Color(0xfff6fafe),
      onBackground: Color(0xff171c1f),
      surface: Color(0xfff6fafe),
      onSurface: Color(0xff171c1f),
      surfaceVariant: Color(0xffdce3e9),
      onSurfaceVariant: Color(0xff40484c),
      outline: Color(0xff71787d),
      outlineVariant: Color(0xffc0c7cd),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff2c3134),
      inverseOnSurface: Color(0xffedf1f5),
      inversePrimary: Color(0xff8dcff1),
      primaryFixed: Color(0xffc1e8ff),
      onPrimaryFixed: Color(0xff001e2b),
      primaryFixedDim: Color(0xff8dcff1),
      onPrimaryFixedVariant: Color(0xff004d66),
      secondaryFixed: Color(0xffd0e6f3),
      onSecondaryFixed: Color(0xff091e27),
      secondaryFixedDim: Color(0xffb5cad6),
      onSecondaryFixedVariant: Color(0xff364954),
      tertiaryFixed: Color(0xffe5deff),
      onTertiaryFixed: Color(0xff1b1736),
      tertiaryFixedDim: Color(0xffc8c2ea),
      onTertiaryFixedVariant: Color(0xff474364),
      surfaceDim: Color(0xffd6dade),
      surfaceBright: Color(0xfff6fafe),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfff0f4f8),
      surfaceContainer: Color(0xffeaeef2),
      surfaceContainerHigh: Color(0xffe4e9ed),
      surfaceContainerHighest: Color(0xffdfe3e7),
    );
  }

  ThemeData light() {
    return theme(lightScheme().toColorScheme());
  }

  static MaterialScheme lightMediumContrastScheme() {
    return const MaterialScheme(
      brightness: Brightness.light,
      primary: Color(0xff004961),
      surfaceTint: Color(0xff176684),
      onPrimary: Color(0xffffffff),
      primaryContainer: Color(0xff367c9b),
      onPrimaryContainer: Color(0xffffffff),
      secondary: Color(0xff324550),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xff637783),
      onSecondaryContainer: Color(0xffffffff),
      tertiary: Color(0xff433f60),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xff757094),
      onTertiaryContainer: Color(0xffffffff),
      error: Color(0xff8c0009),
      onError: Color(0xffffffff),
      errorContainer: Color(0xffda342e),
      onErrorContainer: Color(0xffffffff),
      background: Color(0xfff6fafe),
      onBackground: Color(0xff171c1f),
      surface: Color(0xfff6fafe),
      onSurface: Color(0xff171c1f),
      surfaceVariant: Color(0xffdce3e9),
      onSurfaceVariant: Color(0xff3c4448),
      outline: Color(0xff596065),
      outlineVariant: Color(0xff747c81),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff2c3134),
      inverseOnSurface: Color(0xffedf1f5),
      inversePrimary: Color(0xff8dcff1),
      primaryFixed: Color(0xff367c9b),
      onPrimaryFixed: Color(0xffffffff),
      primaryFixedDim: Color(0xff136381),
      onPrimaryFixedVariant: Color(0xffffffff),
      secondaryFixed: Color(0xff637783),
      onSecondaryFixed: Color(0xffffffff),
      secondaryFixedDim: Color(0xff4b5f6a),
      onSecondaryFixedVariant: Color(0xffffffff),
      tertiaryFixed: Color(0xff757094),
      onTertiaryFixed: Color(0xffffffff),
      tertiaryFixedDim: Color(0xff5c587a),
      onTertiaryFixedVariant: Color(0xffffffff),
      surfaceDim: Color(0xffd6dade),
      surfaceBright: Color(0xfff6fafe),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfff0f4f8),
      surfaceContainer: Color(0xffeaeef2),
      surfaceContainerHigh: Color(0xffe4e9ed),
      surfaceContainerHighest: Color(0xffdfe3e7),
    );
  }

  ThemeData lightMediumContrast() {
    return theme(lightMediumContrastScheme().toColorScheme());
  }

  static MaterialScheme lightHighContrastScheme() {
    return const MaterialScheme(
      brightness: Brightness.light,
      primary: Color(0xff002634),
      surfaceTint: Color(0xff176684),
      onPrimary: Color(0xffffffff),
      primaryContainer: Color(0xff004961),
      onPrimaryContainer: Color(0xffffffff),
      secondary: Color(0xff10252e),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xff324550),
      onSecondaryContainer: Color(0xffffffff),
      tertiary: Color(0xff221e3d),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xff433f60),
      onTertiaryContainer: Color(0xffffffff),
      error: Color(0xff4e0002),
      onError: Color(0xffffffff),
      errorContainer: Color(0xff8c0009),
      onErrorContainer: Color(0xffffffff),
      background: Color(0xfff6fafe),
      onBackground: Color(0xff171c1f),
      surface: Color(0xfff6fafe),
      onSurface: Color(0xff000000),
      surfaceVariant: Color(0xffdce3e9),
      onSurfaceVariant: Color(0xff1e2529),
      outline: Color(0xff3c4448),
      outlineVariant: Color(0xff3c4448),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff2c3134),
      inverseOnSurface: Color(0xffffffff),
      inversePrimary: Color(0xffd7f0ff),
      primaryFixed: Color(0xff004961),
      onPrimaryFixed: Color(0xffffffff),
      primaryFixedDim: Color(0xff003143),
      onPrimaryFixedVariant: Color(0xffffffff),
      secondaryFixed: Color(0xff324550),
      onSecondaryFixed: Color(0xffffffff),
      secondaryFixedDim: Color(0xff1b2f39),
      onSecondaryFixedVariant: Color(0xffffffff),
      tertiaryFixed: Color(0xff433f60),
      onTertiaryFixed: Color(0xffffffff),
      tertiaryFixedDim: Color(0xff2c2948),
      onTertiaryFixedVariant: Color(0xffffffff),
      surfaceDim: Color(0xffd6dade),
      surfaceBright: Color(0xfff6fafe),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfff0f4f8),
      surfaceContainer: Color(0xffeaeef2),
      surfaceContainerHigh: Color(0xffe4e9ed),
      surfaceContainerHighest: Color(0xffdfe3e7),
    );
  }

  ThemeData lightHighContrast() {
    return theme(lightHighContrastScheme().toColorScheme());
  }

  static MaterialScheme darkScheme() {
    return const MaterialScheme(
      brightness: Brightness.dark,
      primary: Color(0xff8dcff1),
      surfaceTint: Color(0xff8dcff1),
      onPrimary: Color(0xff003548),
      primaryContainer: Color(0xff004d66),
      onPrimaryContainer: Color(0xffc1e8ff),
      secondary: Color(0xffb5cad6),
      onSecondary: Color(0xff1f333d),
      secondaryContainer: Color(0xff364954),
      onSecondaryContainer: Color(0xffd0e6f3),
      tertiary: Color(0xffc8c2ea),
      onTertiary: Color(0xff302c4c),
      tertiaryContainer: Color(0xff474364),
      onTertiaryContainer: Color(0xffe5deff),
      error: Color(0xffffb4ab),
      onError: Color(0xff690005),
      errorContainer: Color(0xff93000a),
      onErrorContainer: Color(0xffffdad6),
      background: Color(0xff0f1417),
      onBackground: Color(0xffdfe3e7),
      surface: Color(0xff0f1417),
      onSurface: Color(0xffdfe3e7),
      surfaceVariant: Color(0xff40484c),
      onSurfaceVariant: Color(0xffc0c7cd),
      outline: Color(0xff8a9297),
      outlineVariant: Color(0xff40484c),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffdfe3e7),
      inverseOnSurface: Color(0xff2c3134),
      inversePrimary: Color(0xff176684),
      primaryFixed: Color(0xffc1e8ff),
      onPrimaryFixed: Color(0xff001e2b),
      primaryFixedDim: Color(0xff8dcff1),
      onPrimaryFixedVariant: Color(0xff004d66),
      secondaryFixed: Color(0xffd0e6f3),
      onSecondaryFixed: Color(0xff091e27),
      secondaryFixedDim: Color(0xffb5cad6),
      onSecondaryFixedVariant: Color(0xff364954),
      tertiaryFixed: Color(0xffe5deff),
      onTertiaryFixed: Color(0xff1b1736),
      tertiaryFixedDim: Color(0xffc8c2ea),
      onTertiaryFixedVariant: Color(0xff474364),
      surfaceDim: Color(0xff0f1417),
      surfaceBright: Color(0xff353a3d),
      surfaceContainerLowest: Color(0xff0a0f12),
      surfaceContainerLow: Color(0xff171c1f),
      surfaceContainer: Color(0xff1b2023),
      surfaceContainerHigh: Color(0xff262b2e),
      surfaceContainerHighest: Color(0xff313539),
    );
  }

  ThemeData dark() {
    return theme(darkScheme().toColorScheme());
  }

  static MaterialScheme darkMediumContrastScheme() {
    return const MaterialScheme(
      brightness: Brightness.dark,
      primary: Color(0xff91d3f6),
      surfaceTint: Color(0xff8dcff1),
      onPrimary: Color(0xff001924),
      primaryContainer: Color(0xff5699b9),
      onPrimaryContainer: Color(0xff000000),
      secondary: Color(0xffb9cedb),
      onSecondary: Color(0xff041922),
      secondaryContainer: Color(0xff7f94a0),
      onSecondaryContainer: Color(0xff000000),
      tertiary: Color(0xffccc6ee),
      onTertiary: Color(0xff161230),
      tertiaryContainer: Color(0xff928cb2),
      onTertiaryContainer: Color(0xff000000),
      error: Color(0xffffbab1),
      onError: Color(0xff370001),
      errorContainer: Color(0xffff5449),
      onErrorContainer: Color(0xff000000),
      background: Color(0xff0f1417),
      onBackground: Color(0xffdfe3e7),
      surface: Color(0xff0f1417),
      onSurface: Color(0xfff7fbff),
      surfaceVariant: Color(0xff40484c),
      onSurfaceVariant: Color(0xffc4ccd1),
      outline: Color(0xff9ca4a9),
      outlineVariant: Color(0xff7d8489),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffdfe3e7),
      inverseOnSurface: Color(0xff262b2e),
      inversePrimary: Color(0xff004e68),
      primaryFixed: Color(0xffc1e8ff),
      onPrimaryFixed: Color(0xff00131d),
      primaryFixedDim: Color(0xff8dcff1),
      onPrimaryFixedVariant: Color(0xff003b50),
      secondaryFixed: Color(0xffd0e6f3),
      onSecondaryFixed: Color(0xff00131d),
      secondaryFixedDim: Color(0xffb5cad6),
      onSecondaryFixedVariant: Color(0xff253943),
      tertiaryFixed: Color(0xffe5deff),
      onTertiaryFixed: Color(0xff100c2b),
      tertiaryFixedDim: Color(0xffc8c2ea),
      onTertiaryFixedVariant: Color(0xff363252),
      surfaceDim: Color(0xff0f1417),
      surfaceBright: Color(0xff353a3d),
      surfaceContainerLowest: Color(0xff0a0f12),
      surfaceContainerLow: Color(0xff171c1f),
      surfaceContainer: Color(0xff1b2023),
      surfaceContainerHigh: Color(0xff262b2e),
      surfaceContainerHighest: Color(0xff313539),
    );
  }

  ThemeData darkMediumContrast() {
    return theme(darkMediumContrastScheme().toColorScheme());
  }

  static MaterialScheme darkHighContrastScheme() {
    return const MaterialScheme(
      brightness: Brightness.dark,
      primary: Color(0xfff7fbff),
      surfaceTint: Color(0xff8dcff1),
      onPrimary: Color(0xff000000),
      primaryContainer: Color(0xff91d3f6),
      onPrimaryContainer: Color(0xff000000),
      secondary: Color(0xfff7fbff),
      onSecondary: Color(0xff000000),
      secondaryContainer: Color(0xffb9cedb),
      onSecondaryContainer: Color(0xff000000),
      tertiary: Color(0xfffef9ff),
      onTertiary: Color(0xff000000),
      tertiaryContainer: Color(0xffccc6ee),
      onTertiaryContainer: Color(0xff000000),
      error: Color(0xfffff9f9),
      onError: Color(0xff000000),
      errorContainer: Color(0xffffbab1),
      onErrorContainer: Color(0xff000000),
      background: Color(0xff0f1417),
      onBackground: Color(0xffdfe3e7),
      surface: Color(0xff0f1417),
      onSurface: Color(0xffffffff),
      surfaceVariant: Color(0xff40484c),
      onSurfaceVariant: Color(0xfff7fbff),
      outline: Color(0xffc4ccd1),
      outlineVariant: Color(0xffc4ccd1),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffdfe3e7),
      inverseOnSurface: Color(0xff000000),
      inversePrimary: Color(0xff002e3f),
      primaryFixed: Color(0xffcbecff),
      onPrimaryFixed: Color(0xff000000),
      primaryFixedDim: Color(0xff91d3f6),
      onPrimaryFixedVariant: Color(0xff001924),
      secondaryFixed: Color(0xffd5eaf7),
      onSecondaryFixed: Color(0xff000000),
      secondaryFixedDim: Color(0xffb9cedb),
      onSecondaryFixedVariant: Color(0xff041922),
      tertiaryFixed: Color(0xffe9e3ff),
      onTertiaryFixed: Color(0xff000000),
      tertiaryFixedDim: Color(0xffccc6ee),
      onTertiaryFixedVariant: Color(0xff161230),
      surfaceDim: Color(0xff0f1417),
      surfaceBright: Color(0xff353a3d),
      surfaceContainerLowest: Color(0xff0a0f12),
      surfaceContainerLow: Color(0xff171c1f),
      surfaceContainer: Color(0xff1b2023),
      surfaceContainerHigh: Color(0xff262b2e),
      surfaceContainerHighest: Color(0xff313539),
    );
  }

  ThemeData darkHighContrast() {
    return theme(darkHighContrastScheme().toColorScheme());
  }

  ThemeData theme(ColorScheme colorScheme) => ThemeData(
        useMaterial3: true,
        brightness: colorScheme.brightness,
        colorScheme: colorScheme,
        textTheme: textTheme.apply(
          bodyColor: colorScheme.onSurface,
          displayColor: colorScheme.onSurface,
        ),
        scaffoldBackgroundColor: colorScheme.surface,
        canvasColor: colorScheme.surface,
      );

  List<ExtendedColor> get extendedColors => [];
}

class MaterialScheme {
  const MaterialScheme({
    required this.brightness,
    required this.primary,
    required this.surfaceTint,
    required this.onPrimary,
    required this.primaryContainer,
    required this.onPrimaryContainer,
    required this.secondary,
    required this.onSecondary,
    required this.secondaryContainer,
    required this.onSecondaryContainer,
    required this.tertiary,
    required this.onTertiary,
    required this.tertiaryContainer,
    required this.onTertiaryContainer,
    required this.error,
    required this.onError,
    required this.errorContainer,
    required this.onErrorContainer,
    required this.background,
    required this.onBackground,
    required this.surface,
    required this.onSurface,
    required this.surfaceVariant,
    required this.onSurfaceVariant,
    required this.outline,
    required this.outlineVariant,
    required this.shadow,
    required this.scrim,
    required this.inverseSurface,
    required this.inverseOnSurface,
    required this.inversePrimary,
    required this.primaryFixed,
    required this.onPrimaryFixed,
    required this.primaryFixedDim,
    required this.onPrimaryFixedVariant,
    required this.secondaryFixed,
    required this.onSecondaryFixed,
    required this.secondaryFixedDim,
    required this.onSecondaryFixedVariant,
    required this.tertiaryFixed,
    required this.onTertiaryFixed,
    required this.tertiaryFixedDim,
    required this.onTertiaryFixedVariant,
    required this.surfaceDim,
    required this.surfaceBright,
    required this.surfaceContainerLowest,
    required this.surfaceContainerLow,
    required this.surfaceContainer,
    required this.surfaceContainerHigh,
    required this.surfaceContainerHighest,
  });

  final Brightness brightness;
  final Color primary;
  final Color surfaceTint;
  final Color onPrimary;
  final Color primaryContainer;
  final Color onPrimaryContainer;
  final Color secondary;
  final Color onSecondary;
  final Color secondaryContainer;
  final Color onSecondaryContainer;
  final Color tertiary;
  final Color onTertiary;
  final Color tertiaryContainer;
  final Color onTertiaryContainer;
  final Color error;
  final Color onError;
  final Color errorContainer;
  final Color onErrorContainer;
  final Color background;
  final Color onBackground;
  final Color surface;
  final Color onSurface;
  final Color surfaceVariant;
  final Color onSurfaceVariant;
  final Color outline;
  final Color outlineVariant;
  final Color shadow;
  final Color scrim;
  final Color inverseSurface;
  final Color inverseOnSurface;
  final Color inversePrimary;
  final Color primaryFixed;
  final Color onPrimaryFixed;
  final Color primaryFixedDim;
  final Color onPrimaryFixedVariant;
  final Color secondaryFixed;
  final Color onSecondaryFixed;
  final Color secondaryFixedDim;
  final Color onSecondaryFixedVariant;
  final Color tertiaryFixed;
  final Color onTertiaryFixed;
  final Color tertiaryFixedDim;
  final Color onTertiaryFixedVariant;
  final Color surfaceDim;
  final Color surfaceBright;
  final Color surfaceContainerLowest;
  final Color surfaceContainerLow;
  final Color surfaceContainer;
  final Color surfaceContainerHigh;
  final Color surfaceContainerHighest;
}

extension MaterialSchemeUtils on MaterialScheme {
  ColorScheme toColorScheme() {
    return ColorScheme(
      brightness: brightness,
      primary: primary,
      onPrimary: onPrimary,
      primaryContainer: primaryContainer,
      onPrimaryContainer: onPrimaryContainer,
      secondary: secondary,
      onSecondary: onSecondary,
      secondaryContainer: secondaryContainer,
      onSecondaryContainer: onSecondaryContainer,
      tertiary: tertiary,
      onTertiary: onTertiary,
      tertiaryContainer: tertiaryContainer,
      onTertiaryContainer: onTertiaryContainer,
      error: error,
      onError: onError,
      errorContainer: errorContainer,
      onErrorContainer: onErrorContainer,
      background: background,
      onBackground: onBackground,
      surface: surface,
      onSurface: onSurface,
      surfaceVariant: surfaceVariant,
      onSurfaceVariant: onSurfaceVariant,
      outline: outline,
      outlineVariant: outlineVariant,
      shadow: shadow,
      scrim: scrim,
      inverseSurface: inverseSurface,
      onInverseSurface: inverseOnSurface,
      inversePrimary: inversePrimary,
    );
  }
}

class ExtendedColor {
  final Color seed, value;
  final ColorFamily light;
  final ColorFamily lightHighContrast;
  final ColorFamily lightMediumContrast;
  final ColorFamily dark;
  final ColorFamily darkHighContrast;
  final ColorFamily darkMediumContrast;

  const ExtendedColor({
    required this.seed,
    required this.value,
    required this.light,
    required this.lightHighContrast,
    required this.lightMediumContrast,
    required this.dark,
    required this.darkHighContrast,
    required this.darkMediumContrast,
  });
}

class ColorFamily {
  const ColorFamily({
    required this.color,
    required this.onColor,
    required this.colorContainer,
    required this.onColorContainer,
  });

  final Color color;
  final Color onColor;
  final Color colorContainer;
  final Color onColorContainer;
}
