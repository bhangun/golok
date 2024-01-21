// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:logging/logging.dart';

import 'modules/main/main_routes.dart';
import 'modules/auth/blogic/auth_bloc.dart';
import 'utils/modules/modules_registry.dart';
import 'utils/routes.dart';
import 'themes/app_theme.dart';
import 'modules/settings/settings_bloc.dart';


Future<void> main() async {
  // Initialized
  WidgetsFlutterBinding.ensureInitialized();

  Logger.root.level = Level.ALL;
  Logger.root.onRecord.listen((record) {
    if (kDebugMode) {
      print('${record.level.name}: ${record.time}: ${record.message}');
    }
  });

  // Register all module
  ModulesRegistry.routes();

  // Run main app
  runApp(const ProviderScope(child: GolokApp()));
}

class GolokApp extends ConsumerWidget {
  const GolokApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settingState = ref.watch(settingsBloc);
    List<Locale> supportedLocales = ref.read(settingsBloc).supportedLocales;
    return MaterialApp.router(
        key: GlobalKey<NavigatorState>(),
        theme: AppTheme.lightTheme(),
        darkTheme: AppTheme.darkTheme(),
        themeMode: settingState.isLightTheme ? ThemeMode.light : ThemeMode.dark,
        routerConfig: Routes.config(ref:ref, initial: MainRoutes.main, isLoggedIn: ref.watch(authBloc.notifier).loggedIn),
        debugShowCheckedModeBanner: false,
        locale: settingState.locale,
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: supportedLocales);
  }
}
