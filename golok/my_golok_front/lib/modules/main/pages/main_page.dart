import 'package:adaptive_screen/device_info.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:golok_apps/utils/modules/modules.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:logging/logging.dart';

import '../../../layout/adaptive_layout.dart';
import '../../../utils/modules/modules_registry.dart';
import '../blogics/auth_bloc.dart';
import '../blogics/settings_bloc.dart';
import '../../dashboard/bloc/menu_bloc.dart';
import '../../../models/menu.dart';
import '../../../widgets/dropdown_widget.dart';
import '../../../widgets/profile_widget.dart';


final log = Logger('MainPage');

class MainPage extends HookConsumerWidget {
  final Widget child;
  const MainPage({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ModulesRegistry.pages(context);

    final pageIndex = useState(0);
    String account = 'Fulan';
    String title = 'Dashboard';
    var settings = ref.watch(settingsBloc);
    List<Menu> menus = Modules.pages;//(context);

    return AdaptiveLayout(
      title: const Text('Golok'),
      actions: [
        // Title
        if (!DeviceScreen.isPhone(context)) Text(title),

        // Space
        if (!DeviceScreen.isPhone(context))
          Spacer(flex: DeviceScreen.isLargeScreen(context) ? 2 : 1),

        // Switch them button
        IconButton(
            splashRadius: 15,
            icon: settings.isLightTheme
                ? const Icon(Icons.dark_mode)
                : const Icon(Icons.light_mode),
            onPressed: () => ref.read(settingsBloc).switchTheme()),

        // Switch language menu
        Dropdown(items: [
          DropdownItem(
              title: 'Bahasa',
              onTap: () => ref.read(settingsBloc).switchLocale('ID')),
          DropdownItem(
              title: 'English',
              onTap: () => ref.read(settingsBloc).switchLocale('EN'))
        ]),

        // Profile Menu
        if (!DeviceScreen.isLargeScreen(context))
          IconButton(
            icon: const Icon(Icons.menu),
            onPressed: ref.read(menuBloc).controlMenu,
          ),
        ProfileCard(
          accountName: account,
          onTap: () => _handleSignOut(context, ref),
        ),
      ],
      currentIndex: pageIndex.value,
      menuItems: menus,
      body: child,
      onMenuClick: (menu) {
       log.info(menu);
        context.go('/users');
        
        },
      onBottomTap: (value) => pageIndex.value = value,
      floatingActionButton: pageIndex.value == 2 ? null : _buildFab(context),
    );
  }

  FloatingActionButton _buildFab(BuildContext context) {
    return FloatingActionButton(
      child: const Icon(Icons.chat_rounded),
      onPressed: () => _handleFabPressed(),
    );
  }

  void _handleFabPressed() {}

  void _handleSignOut(context, ref) async {
    // ref.watch(authBloc.notifier).signOut();
    showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            child: const Text('No'),
            onPressed: () {},
          ),
          TextButton(
            child: const Text('Yes'),
            onPressed: () {
              ref.watch(authBloc.notifier).signOut();
            },
          ),
        ],
      ),
    );
  }
}
