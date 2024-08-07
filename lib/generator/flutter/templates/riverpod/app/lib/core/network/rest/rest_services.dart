import 'package:dio/dio.dart';
import 'package:logging/logging.dart';

import '../../../modules/auth/services/auth_jwt_services.dart';
import '../../utils/config.dart';
import 'rest_error_util.dart';

final log = Logger('RestServices');

class RestServices {
  static final _dio = Dio()
    ..options.baseUrl = baseURL
    ..options.connectTimeout = const Duration(milliseconds: timeoutConnection)
    ..options.receiveTimeout = const Duration(milliseconds: timeoutReceive)
    ..interceptors.clear()
    ..interceptors.add(LogInterceptor(
        requestBody: false,
        request: false,
        requestHeader: false,
        responseHeader: false,
        responseBody: true))
    ..interceptors.add(InterceptorsWrapper(
        onRequest: (RequestOptions options,
            RequestInterceptorHandler requestHandler) async {
          AuthServices.fetchToken().then((token) => {
                if (token != '')
                  options.headers["Authorization"] = 'Bearer $token'
              });

          requestHandler.next(options);
        },
        onResponse:
            (Response<dynamic> e, ResponseInterceptorHandler responseHandler) =>
                {responseHandler.next(e)},
        onError: (DioException error, ErrorInterceptorHandler errorHandler) {
          log.severe(DioErrorUtil.handleError(error));
          // Do something with response error
          if (error.response?.statusCode == 403) {
            // requestLock.lock()-> If no token, request token firstly and lock this interceptor
            // to prevent other request enter this interceptor.
            //_dio.interceptors.requestLock.lock();
            //_dio.interceptors.responseLock.lock();
          }
          errorHandler.next(error);
        }))
    ..interceptors.add(QueuedInterceptor());

  // GET
  static fetch(String uri) async {
    Response response = await _dio.get(uri);
    return response.data;
  }

  // POST
  static post(String uri, dynamic data) async {
    Object response = await _dio
        .post(uri, data: data)
        .then((value) => value.data)
        .onError((error, stackTrace) => error.toString());
    return response;
  }

  // DELETE
  static delete(String uri, [dynamic id]) async {
    Response response = await _dio.delete(uri, data: id);
    return response.data;
  }

  // PUT
  static update(String uri, dynamic data) async {
    Response response = await _dio.put(uri, data: data);
    return response.data;
  }
}
