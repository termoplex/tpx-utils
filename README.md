# TPX-Utils
Useful functions for objects

## Installing
```
npm i tpx-utils --save
```

## How to use
```js 
const { 
  deepObjSet, 
  deepObjFind, 
  deepObjCastingSet 
} = require('tpx-utils');

//Compare a object to a model, uses the model property if it doesn´t exists in obj
deepObjSet({ foo: 1, bar: 2 }, { baz: { xyz: 3 } }); 
//{ foo: 1, bar: 2, { baz: { xyz: 3 } } }

//Find a property with a string in its name
deepObjFind({ foo: { bar: 1 } }, 'bar', (obj, prop) => { 
  //{ bar: 1 }, bar 
});

//Compare a object to a model, cast the property to the model type, assigns to an object
deepObjCastingSet(
  { foo: 1, bar: '2', { baz: { xyz: 3 } }}, 
  { bar: 0, { baz: { xyz: '' } }});
//{ bar: 2, { baz: { xyz: '3' } }}
```