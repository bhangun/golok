import 'package:adaptive_screen/adaptive_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../core/utils/config.dart';
import '../../core/utils/helper.dart';
import '../../shared/widgets/form/textfield_widget.dart';
import '../logics/auth_bloc.dart';


class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  Loginpagestate createState() => Loginpagestate();
}

class Loginpagestate extends ConsumerState<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  late FocusNode _passwordFocusNode;
  final _formKey = GlobalKey<FormState>();
  bool _isEyeOpen = true;
  bool _isObscure = true;
  String? username;
  String? password;

  @override
  void initState() {
    _passwordFocusNode = FocusNode();
    super.initState();
  }

  @override
  void dispose() {
    // Clean up the controller when the Widget is removed from the Widget tree
    _usernameController.dispose();
    _passwordController.dispose();
    _passwordFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    _usernameController.addListener(() {
      username = _usernameController.text;
    });

    _passwordController.addListener(() {
      password = _passwordController.text;
    });
    return Scaffold(
        primary: true,
        body: Form(
            key: _formKey,
            child: AdaptiveScreen(
                phone: signInFormPhoneScreen(context),
                largeScreen: signInFormPhoneScreen(context),
                mediumScreen: signInFormPhoneScreen(context))));
  }

  Widget signInFormPhoneScreen(context) => Center(
      child: SizedBox(
          width: 500,
          height: 300,
          child: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset(
                imageSplash,
                width: 60,
                height: 60,
              ),
              const SizedBox(height: 24.0),
              _usernameField(context),
              _passwordField(context),
              _forgotPasswordButton(),
              _signInButton(),
            ],
          )));

  _usernameField(context) => TextFieldWidget(
        hint: AppLocalizations.of(context)!.email,
        inputType: TextInputType.emailAddress,
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter some text';
          } else if (!validateEmail(value)) {
            return 'Not email';
          }
          return null;
        },
        icon: Icons.person,
        iconColor: Theme.of(context).iconTheme.color!,
        textController: _usernameController,
        inputAction: TextInputAction.next,
        onFieldSubmitted: (value) {
          FocusScope.of(context).requestFocus(_passwordFocusNode);
        },
        errorText: ref.watch(authBloc).loginMessage,
      );

  Widget _passwordField(context) => TextFieldWidget(
        hint: AppLocalizations.of(context)!.password,
        isObscure: _isObscure,
        padding: const EdgeInsets.only(top: 16.0),
        icon: Icons.lock,
        iconColor: Theme.of(context).iconTheme.color!,
        textController: _passwordController,
        focusNode: _passwordFocusNode,
        errorText: ref.watch(authBloc).passwordMessage,
        onEyePressed: () => _onEyePressed(),
        isEyeOpen: _isEyeOpen,
        showEye: true,
        validator: (value) {
          if (value!.isEmpty) {
            return AppLocalizations.of(context)!.passwordEmpty;
          } else if (value.length < 4) {
            return AppLocalizations.of(context)!.passwordLength;
          }
          return '';
        },
      );

  Widget _forgotPasswordButton() => Align(
      alignment: FractionalOffset.centerRight,
      child: TextButton(
          key: const Key('user_forgot_password'),
          child: Text(AppLocalizations.of(context)!.forgot_password),
          onPressed: () => ref.read(authBloc.notifier).forgotPassword()));

  Widget _signInButton() => ElevatedButton(
        key: const Key('user_sign_button'),
        onPressed: () {
          
          ref.read(authBloc.notifier).signIn(context);
          context.go('/');
        },
        child: Text(AppLocalizations.of(context)!.sign_in),
      );

  _onEyePressed() {
    setState(() {
      _isEyeOpen = _isEyeOpen ? false : true;
      _isObscure = _isEyeOpen ? true : false;
    });
  }
}
