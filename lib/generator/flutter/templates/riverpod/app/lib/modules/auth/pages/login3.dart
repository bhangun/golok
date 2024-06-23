import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:syirkah/modules/main/main_module.dart';
//import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:kayys_components/kayys_components.dart';
import '../../../utils/helper.dart';
import '../blogic/auth_bloc.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  LoginPageState createState() => LoginPageState();
}

class LoginPageState extends ConsumerState<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  late FocusNode _passwordFocusNode;
  bool _isEyeOpen = true;
  bool _isObscure = true;
  bool showEye = false;

  @override
  void initState() {
    super.initState();
    _passwordFocusNode = FocusNode();

    _emailController.addListener(() {
      print('--email---');
    });

    _passwordController.addListener(() {
      print('--pass---');
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _signInWithGoogle() async {
    // Replace with your Google Sign-In configuration
    /* final googleSignIn = GoogleSignIn(
      scopes: ['email'],
    );
    final googleUser = await googleSignIn.signIn(); */
    // Handle user authentication
    // ...
  }

  @override
  Widget build(BuildContext context) {
    LoginState auth = ref.watch(loginState);
    /* Widget mm = switch (auth) {
      AsyncData(:final value) => Text('data: $value'),
      AsyncError(:final error) => Text('error: $error'),
      _ => const Text('loading'),
    }; */

    return Scaffold(
        appBar: AppBar(
            // title: Text('Login'),
            ),
        body: Center(
            child: SizedBox(
                width: 500,
                height: 500,
                child: Column(
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      /* SvgPicture.asset(
                        imageSplash,
                        width: 60,
                        height: 60,
                      ), */
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              /// Username
                              TextFormField(
                                onChanged: (val) {
                                  print('>>> $val');
                                  ref.read(loginState.notifier).setEmail(val);
                                },
                                controller: _emailController,
                                decoration: InputDecoration(
                                  labelText:
                                      AppLocalizations.of(context)!.email,
                                ),
                                keyboardType: TextInputType.emailAddress,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return AppLocalizations.of(context)!
                                        .loginEmpty;
                                  }
                                  if (!validateEmail(value)) {
                                    return AppLocalizations.of(context)!
                                        .errorUsername;
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16.0),

                              /// Password
                              TextFieldWidget(
                                hint: AppLocalizations.of(context)!.password,
                                isObscure: _isObscure,
                                padding: const EdgeInsets.only(top: 16.0),
                                icon: Icons.lock,
                                onFieldSubmitted: onPressesLogin,
                                onChanged: (val) {
                                   print('>pass>> $val');
                                  ref
                                      .read(loginState.notifier)
                                      .setPassword(val);
                                },
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return AppLocalizations.of(context)!
                                        .passwordEmpty;
                                  }
                                  if (value.length < 6) {
                                    return AppLocalizations.of(context)!
                                        .passwordLength;
                                  }

                                  if (auth.isError!) {
                                    return AppLocalizations.of(context)!
                                        .passwordMatch;
                                  }
                                  return null;
                                },
                                iconColor: Theme.of(context).iconTheme.color!,
                                textController: _passwordController,
                                focusNode: _passwordFocusNode,
                                // errorText: ref.watch(loginState).passwordMatch,
                                onEyePressed: () => _onEyePressed(),
                                isEyeOpen: _isEyeOpen,
                                showEye: true,
                              ),
                              /* Stack(
                                  alignment: Alignment.bottomRight,
                                  children: [
                                    TextFormField(
                                      onTap: onPressesLogin,
                                      onChanged: (val) {
                                        ref
                                            .read(loginState.notifier)
                                            .setPassword(val);
                                      },
                                      controller: _passwordController,
                                      obscureText: _isObscure,
                                      decoration: InputDecoration(
                                        labelText: AppLocalizations.of(context)!
                                            .password,
                                      ),
                                      validator: (value) {
                                        if (value == null || value.isEmpty) {
                                          return AppLocalizations.of(context)!
                                              .passwordEmpty;
                                        }
                                        if (value.length < 6) {
                                          return AppLocalizations.of(context)!
                                              .passwordLength;
                                        }

                                        if (auth.isError!) {
                                          return AppLocalizations.of(context)!
                                              .passwordMatch;
                                        }
                                        return null;
                                      },
                                    ),
                                    IconButton(
                                        splashRadius: 15,
                                        onPressed: () {
                                          setState(() {
                                            _isEyeOpen =
                                                _isEyeOpen ? false : true;
                                            _isObscure =
                                                _isEyeOpen ? true : false;
                                          });
                                        },
                                        icon: Icon(
                                          _isEyeOpen
                                              ? Icons.visibility
                                              : Icons.visibility_off,
                                          color: Colors.black,
                                        ))
                                  ]), */
                              const SizedBox(height: 24.0),

                              /// Login button
                              ElevatedButton(
                                onPressed: () {
                                  if (_formKey.currentState!.validate()) {
                                    ref
                                        .read(loginState.notifier)
                                        .login(context);
                                  }
                                },
                                child:
                                    Text(AppLocalizations.of(context)!.sign_in),
                              ),
                              const SizedBox(height: 16.0),

                              /// Forgot Password button
                              RichText(
                                  text: TextSpan(
                                      style:
                                          const TextStyle(color: Colors.blue),
                                      recognizer: TapGestureRecognizer()
                                        ..onTap =
                                            () => context.go(MainModule.signup),
                                      text: AppLocalizations.of(context)!
                                          .forgot_password)),

                              const SizedBox(height: 16.0),

                              ElevatedButton(
                                onPressed: _signInWithGoogle,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Image.asset(
                                      'assets/icons/google_logo.png', // Replace with your Google logo asset
                                      height: 24.0,
                                    ),
                                    const SizedBox(width: 8.0),
                                    const Text('Sign in with Google'),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 16.0),
                              RichText(
                                  text: TextSpan(children: [
                                TextSpan(
                                    style: const TextStyle(color: Colors.black),
                                    text: AppLocalizations.of(context)!
                                        .dont_have_account),
                                TextSpan(
                                    style: const TextStyle(color: Colors.blue),
                                    recognizer: TapGestureRecognizer()
                                      ..onTap =
                                          () => context.go(MainModule.signup),
                                    text: AppLocalizations.of(context)!.sign_up)
                              ]))
                            ],
                          ),
                        ),
                      ),
                    ]))));
  }

  _onEyePressed() {
    setState(() {
      _isEyeOpen = _isEyeOpen ? false : true;
      _isObscure = _isEyeOpen ? true : false;
    });
  }

  void onPressesLogin(val) {
    if (_formKey.currentState!.validate()) {
      ref.read(loginState.notifier).login(context);
    }
  }
}
