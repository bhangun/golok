import 'package:flutter/foundation.dart';

@immutable
class StateStatus {
  final bool isSuccess;
  final bool isCancel;
  final bool isLoading;
  final bool isError;
  final bool showError;
  final String? errorMessage;

  const StateStatus({
    this.isSuccess = false,
    this.isCancel = false,
    this.isLoading = false,
    this.isError = false,
    this.showError = false,
    this.errorMessage,
  });

  StateStatus copyWith({
    bool? isSuccess,
    bool? isCancel,
    bool? isLoading,
    bool? isError,
    bool? showError,
    String? errorMessage,
  }) {
    return StateStatus(
      isSuccess: isSuccess ?? this.isSuccess,
      isCancel: isCancel ?? this.isCancel,
      isLoading: isLoading ?? this.isLoading,
      isError: isError ?? this.isError,
      showError: showError ?? this.showError,
      errorMessage: errorMessage,
    );
  }
}

@immutable
class FormStatus {
  final bool isCleared;
  final bool isFilled;
  final bool isChanged;
  final bool isEnable;
  final bool isPending;
  final bool isCancel;
  final bool isSubmit;

  const FormStatus({
    this.isCleared = false,
    this.isFilled = false,
    this.isChanged = false,
    this.isEnable = false,
    this.isPending = false,
    this.isCancel = false,
    this.isSubmit = false,
  });

  FormStatus copyWith({
    bool? isCleared,
    bool? isFilled,
    bool? isChanged,
    bool? isEnable,
    bool? isPending,
    bool? isCancel,
    bool? isSubmit,
  }) {
    return FormStatus(
      isCleared: isCleared ?? this.isCleared,
      isFilled: isFilled ?? this.isFilled,
      isChanged: isChanged ?? this.isChanged,
      isEnable: isEnable ?? this.isEnable,
      isPending: isPending ?? this.isPending,
      isCancel: isCancel ?? this.isCancel,
      isSubmit: isSubmit ?? this.isSubmit,
    );
  }
}
