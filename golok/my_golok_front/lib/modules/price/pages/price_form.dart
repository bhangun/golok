import 'package:flutter/material.dart';

import '../blogic/price_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/price.dart';

class PriceForm extends StatefulWidget {
  final Price? data;
  PriceForm({this.data});
  @override
  _PriceFormState createState() => _PriceFormState();
}

class _PriceFormState extends State<PriceForm> {

  late PriceStore _priceStore = PriceStore();

  @override
  void dispose() {
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
      _priceStore.set(_.text);
    }); 
    _.addListener(() {
      _priceStore.set(_.text);
    }); 
    _.addListener(() {
      _priceStore.set(_.text);
    }); 
    _.addListener(() {
      _priceStore.set(_.text);
    }); 
    _.addListener(() {
      _priceStore.set(_.text);
    }); 
    _.addListener(() {
      _priceStore.set(_.text);
    }); 
    _.addListener(() {
      _priceStore.set(_.text);
    }); 

    return  Scaffold(
            appBar: AppBar(
              title: Text(_priceStore.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _priceStore.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _priceStore.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _priceStore.success
            ? Container()
            : showErrorMessage(context, '') 
        //_priceStore.isModified ? KutAlert() : Container(),
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
      
    ];
  }
}
