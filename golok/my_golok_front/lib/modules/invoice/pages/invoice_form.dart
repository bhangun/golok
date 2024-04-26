import 'package:flutter/material.dart';

import '../blogic/invoice_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/invoice.dart';

class InvoiceForm extends StatefulWidget {
  final Invoice? data;
  InvoiceForm({this.data});
  @override
  _InvoiceFormState createState() => _InvoiceFormState();
}

class _InvoiceFormState extends State<InvoiceForm> {

  late InvoiceStore _invoiceStore = InvoiceStore();

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
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

   
    
    _.addListener(() {
      _invoiceStore.set(_.text);
    }); 
    _.addListener(() {
      _invoiceStore.set(_.text);
    }); 
    _.addListener(() {
      _invoiceStore.set(_.text);
    }); 
    _.addListener(() {
      _invoiceStore.set(_.text);
    }); 
    _.addListener(() {
      _invoiceStore.set(_.text);
    }); 
    _.addListener(() {
      _invoiceStore.set(_.text);
    }); 
    _.addListener(() {
      _invoiceStore.set(_.text);
    }); 
    _.addListener(() {
      _invoiceStore.set(_.text);
    }); 

    return  Scaffold(
            appBar: AppBar(
              title: Text(_invoiceStore.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _invoiceStore.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _invoiceStore.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _invoiceStore.success
            ? Container()
            : showErrorMessage(context, '') 
        //_invoiceStore.isModified ? KutAlert() : Container(),
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
      
    ];
  }
}
