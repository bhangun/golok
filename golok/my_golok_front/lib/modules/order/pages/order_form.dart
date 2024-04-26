import 'package:flutter/material.dart';

import '../blogic/order_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/order.dart';

class OrderForm extends StatefulWidget {
  final Order? data;
  OrderForm({this.data});
  @override
  _OrderFormState createState() => _OrderFormState();
}

class _OrderFormState extends State<OrderForm> {

  late OrderStore _orderStore = OrderStore();

  @override
  void dispose() {
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    _.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

   
    
    _.addListener(() {
      _orderStore.set(_.text);
    }); 
    _.addListener(() {
      _orderStore.set(_.text);
    }); 
    _.addListener(() {
      _orderStore.set(_.text);
    }); 
    _.addListener(() {
      _orderStore.set(_.text);
    }); 
    _.addListener(() {
      _orderStore.set(_.text);
    }); 
    _.addListener(() {
      _orderStore.set(_.text);
    }); 
    _.addListener(() {
      _orderStore.set(_.text);
    }); 
    _.addListener(() {
      _orderStore.set(_.text);
    }); 
    _.addListener(() {
      _orderStore.set(_.text);
    }); 

    return  Scaffold(
            appBar: AppBar(
              title: Text(_orderStore.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _orderStore.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _orderStore.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _orderStore.success
            ? Container()
            : showErrorMessage(context, '') 
        //_orderStore.isModified ? KutAlert() : Container(),
      ],
    );
  }

  _buildForm() {
    return SafeArea(
        child: ListView(
            padding: EdgeInsets.symmetric(horizontal: 24.0),
            children: _buildListChild()));
  }

  _buildListChild() {
    return <Widget>[
      SizedBox(height: 120.0),
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
      TextField(
        controller: _,
        decoration: InputDecoration(
          filled: true,
          labelText: '',
        ),
      ),
      
    ];
  }
}
