import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:go_router/go_router.dart';

import '../../../models/status.dart';

import '../model/auth_model.dart';
import '../services/auth_jwt_services.dart';
import '../../../services/navigation.dart';

final authProvider =
    StateNotifierProvider<AuthenticationNotifier, AuthenticationState>((ref) {
  return AuthenticationNotifier();
});

// Notifier to manage the login state
class AuthenticationNotifier extends StateNotifier<AuthenticationState> {
  AuthenticationNotifier() : super(const AuthenticationState());


  // Trigger the login process
  Future<void> login(String username, String password) async {
    // Simulate loading state
    state = state.copyWith(isLoading: true);


    // Check if the login is successful
    if (state.email == 'test@example.com' && state.password == 'password') {
      state = state.copyWith(isLoggedIn: true, isLoading: false);
      context.go('/');
    } else {
      // Handle login failure
      state = state.copyWith(
          isLoading: false, isError: true, error: 'Invalid credentials');
    }
  }

  // Trigger the login process
  Future<void> logout(BuildContext context) async {
    // Invoke sign out API
    //if(logout to API){
    state = state.copyWith(isLoggedIn: false, isLoading: false);
    context.go('/login');
    /* } else {
      // Handle login failure
      state = state.copyWith(isLoading: false, error: 'Invalid credentials');
    } */
  }
}
/* final authBloc = ChangeNotifierProvider((ref) => AuthBloc(ref: ref));

class AuthBloc extends ChangeNotifier {
  Ref ref;

  String username = '';
  String password = '';
  bool rememberMe = false;
  String token = '';
  // final User user;
  bool loggedIn = false;
  String loginMessage = '';
  String passwordMessage = '';
  String confirmPassword = '';
  String confirmPasswordMessage = '';
  late Status status;
  AuthBloc({required this.ref}) {
    status = const Status();
  }

  bool canRegister() {
    return username.isNotEmpty &&
        password.isNotEmpty &&
        confirmPassword.isNotEmpty;
  }

  bool canForgetPassword() {
    return !status.hasErrorInForgotPassword && username.isNotEmpty;
  }

  signUpDefault() {}

  void setPassword(String value) async {
    _validatePassword(value);
    value;
    notifyListeners();
  }

  void setConfirmPassword(String value) {
    _validateConfirmPassword(value);
    notifyListeners();
  }

  void _validatePassword(String value) {
    if (value.isEmpty) {
      passwordMessage = 'empty';
    } else if (value.length < 6) {
      passwordMessage = 'length';
    } else {
      passwordMessage = '';
    }
  }

  void _validateConfirmPassword(String value) {
    if (value.isEmpty) {
      confirmPasswordMessage = "confirm";
    } else if (value == password) {
      confirmPasswordMessage = "match";
    } else {
      confirmPasswordMessage = '';
    }
  }

  String messagePassword(context) {
    switch (passwordMessage) {
      case "confirm":
        return AppLocalizations.of(context)!.passwordConfirm;
      case "empty":
        return AppLocalizations.of(context)!.passwordEmpty;
      case "length":
        return AppLocalizations.of(context)!.passwordLength;
      case "match":
        return AppLocalizations.of(context)!.passwordMatch;
      default:
        return "";
    }
  }

  message(context) {
    Status(errorMessage: AppLocalizations.of(context)!.errorUnauthorized);
    switch (status.errorMessage) {
      case "unauthorized":
        Status(errorMessage: AppLocalizations.of(context)!.errorUnauthorized);
        break;
      case "username":
        return AppLocalizations.of(context)!.errorUsername;
      default:
        return AppLocalizations.of(context)!.errorNetwork;
    }
  }

  signIn(context) {
    // Status(errorMessage: message(context));
    loggedIn = true;
    /*  AuthServices.login(username, password, rememberMe).then((v) {
      _loggedin(v);
    }); */
    notifyListeners();
  }

  void _loggedin(value) async {
    //int id = (await DatabaseServices.db.fetchObject(value))["user"];
    //for (var user in await AuthServices.userStatic()) {
    /* if (user.id == id) {
        this.user = user;
      } */
    //}

    //NavigationServices.navigateTo(MainModule.main);
    /* if (value == 'SUCCESS') {
      FLog.info(text: "Success login!");
      NavigationServices.navigateTo(MainRoutes.home);
    } else if (value.toString().contains("[401]")) {
      showError = true;
      loading = false;
      errorMessage = "unauthorized";
    } else if (value.toString().contains("[400]")) {
      showError = true;
      loading = false;
      errorMessage = "username";
    } */
  }

  Future register() async {
    const Status(loading: true);
  }

  /*  Future gotoHome() async {
    if (loggedIn) NavigationServices.navigateTo(MainRoutes.home);
  } */

  Future forgotPassword() async {
    const Status(loading: true);
  }

  void signUpWithGoogle() async {}

  void signUpWithFacebook() async {}

  void signUpWithApple() async {}

  void signUpWithTwitter() async {}

  Future<void> logout() async {
    const Status(loading: true);
    AuthServices.logout();
    // NavigationServices.navigateTo(MainRoutes.login);
    const Status(loading: false);
  }

  void signOut() {
    loggedIn = false;
    notifyListeners();
  }
} */

// State for the login screen
class LoginState {
  final String email;
  final String password;
  final bool isLoading;
  final bool isLoggedIn;
  final String? error;
  final bool? isError;

  LoginState({
    required this.email,
    required this.password,
    required this.isLoading,
    required this.isLoggedIn,
    required this.isError,
    this.error,
  });

  LoginState copyWith({
    String? email,
    String? password,
    bool? isLoading,
    bool? isLoggedIn,
    bool? isError,
    String? error,
  }) {
    return LoginState(
      email: email ?? this.email,
      password: password ?? this.password,
      isLoading: isLoading ?? this.isLoading,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      isError: isError ?? this.isError,
      error: error ?? this.error,
    );
  }
}

// Provider for the login state
final loginState = StateNotifierProvider<LoginNotifier, LoginState>((ref) {
  return LoginNotifier();
});

// Notifier to manage the login state
class LoginNotifier extends StateNotifier<LoginState> {
  LoginNotifier()
      : super(LoginState(
            email: '',
            password: '',
            isLoading: false,
            isLoggedIn: false,
            isError: false));

  /
}
