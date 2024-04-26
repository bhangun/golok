import 'package:flutter/material.dart';

import '../blogic/product_blogic.dart';
import '../../widgets/progress_indicator_widget.dart';
import '../../../models/product.dart';

class ProductForm extends StatefulWidget {
  final Product? data;
  ProductForm({this.data});
  @override
  _ProductFormState createState() => _ProductFormState();
}

class _ProductFormState extends State<ProductForm> {

  late ProductStore _productStore = ProductStore();

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
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 
    _.addListener(() {
      _productStore.set(_.text);
    }); 

    return  Scaffold(
            appBar: AppBar(
              title: Text(_productStore.formTitle),
            ),
            body: _buildBody(),
            floatingActionButton: FloatingActionButton(
              onPressed: () => _productStore.save(),
              tooltip: 'Add',
              child: Icon(Icons.save),
            ));
  }

  _buildBody() {
    return Stack(
      children: <Widget>[
        _productStore.loading
            ? CustomProgressIndicatorWidget()
            : Material(child: _buildForm()),
        _productStore.success
            ? Container()
            : showErrorMessage(context, '') 
        //_productStore.isModified ? KutAlert() : Container(),
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
