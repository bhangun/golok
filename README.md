[![Logo][golok-logo]][golok-url]

[![NPM version][npm-image]][npm-url] 

# Golok 
Tools to scaffold apps

![golok Result][golok-result]

## Prerequisite
- NodeJS
- Flutter

## Install
```bash
npm i -g golok
```

## Usage
```bash
golok create yourModelFile.yaml
```
![cli][golok-cli]
![cli][golok-cli-end]


```bash
cd toYourAppFolder
```
because this package use generated intl, which sometime you need to run 'fluter clean' then run.
```bash
flutter clean
flutter run
```

## Model's Specification 
Model to define detail need to generate application.
This model has several main object below:
```
kind: golok-model
version: 1.0
info:
applications:
entities:
enums:
operations:
```

#### Example:
```
info:
  name: lapak
  title: Contoh1
  description: Ini contoh aplikasi
applications:
- name: lapak
  packageName: tech.kays
  frontend:
    framework: flutter
    database: hive
    admin: true
    # Themes option, if not defined would be default.  
    # default | dark | light
    themes: default
    plugins:
    - connection
    stateManagement: riverpod
    # web | android | linux | ios | desktop | all
    platform:
    - web
    - android

    entities:
    - Product
    - Order
    - OrderLine
entities:
- name: Product
  doc: Ini adalah Product
  entityInstance: instance
  properties:
  - name: id
    type: int
    show: false
  - name
  - name: description
    type: string
    truncateAt: 20
  - name: sku
    min: 3
    max: 50
  - name: image
    type: image
  - category
  - name: price
    type: price
  - name: unit
    type: unit
enums:
- unit
  - kg
  - g
  - cm
```

### Info

#### Example:
```
info:
  name: lapak
  title: Contoh1
  description: Ini contoh aplikasi
```
### Applications

#### Example:
```
applications:
- name: lapak
  packageName: tech.kays
  frontend:
    framework: flutter
    database: hive
    admin: true
    # Themes option, if not defined would be default.  
    # default | dark | light
    themes: default
    plugins:
    - connection
    stateManagement: riverpod
    # web | android | linux | ios | desktop | all
    platform:
    - web
    - android

    entities:
    - Product
    - Order
    - OrderLine
```
### Entities

#### Example:
```
entities:
- Product: 
  - name: string, min=3,max=30
  - code: string, min=3,max=30, required
    doc: Product code  
  - sku: int,min=3,max=30, required
  - brand: Brand, manyToOne
  - category: Category, manyToOne
  - staff: User, manyToOne
  - status: Status, manyToOne
  - unit: Unit
```
### enums

#### Example:
```
enums:
- Unit
  - kg
  - g
  - cm
```
### Operations

#### Example:
```
operations:
- name: getConsumer
  path: /apisix/admin/consumers
  verb: get
  doc: Return the consumer list according to the specified page number and page size, and can search consumers by username.
  example:
  - path: /apisix/admin/consumers
    doc: This is doc
  parameters:
  - name: page	
    position: query	
    doc: page number	
    required: no	
    type: integer
  response:
  - code: 200
    type: product
    example: 
  - code: 201
```


## Contribution

### Clone golok
```bash
git clone to/your/golok
```
### Link golok
```bash
npm link to/your/golok
```

### Unlink golok
```bash
npm unlink to/your/golok
```

[golok-cli]: https://github.com/bhangun/repo-assets/blob/master/golok/snapshot/golok-cli.png
[golok-cli-end]: https://github.com/bhangun/repo-assets/blob/master/golok/snapshot/end-cli.png
[golok-logo]: https://raw.githubusercontent.com/bhangun/repo-assets/master/golok/logo/golok.svg
[golok-url]: https://www.npmjs.com/package/golok
[npm-url]: https://www.npmjs.com/package/golok
[npm-image]: https://badge.fury.io/js/golok.svg
[golok-result]: https://github.com/bhangun/repo-assets/blob/master/golok/snapshot/golok-result.png

