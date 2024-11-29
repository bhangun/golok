How to transform from SOURCE to TARGET using deno.

SOURCE:
```
String, max=25, placeholder={id:"Nama Lengkap", en:"Full Name"}, refLink='/name' //Nama produk
```
TARGET:
{
    type: String,
    max: 25,
    placeholder:{
        id:"Nama Lengkap", 
    en:"Full Name"},
    refLink:'/name',
    doc: "Nama produk"
}
