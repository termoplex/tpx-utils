'use strict';

//Module Public API
module.exports = { 
  deepObjSet,
  deepObjFind,
  deepObjCastingSet
};

/************************ */

/**
 * Compare a object to a model, uses the model property if it doesn´t exists in obj
 * @param {Object} obj 
 * @param {Object} model
 * @return {Object} setted config
 */
function deepObjSet(obj, model) {

  var newModel = {};

  for(let prop in obj){
    if(typeof obj[prop] == 'object' && model[prop] && !Array.isArray(model[prop]) && !(model[prop] instanceof Date)){
      newModel[prop] = deepObjSet(obj[prop], model[prop]);
      continue;
    } 
    
    if(typeof model[prop] == 'boolean'){ newModel[prop] = toBoolean(String(obj[prop])); continue; }
    
    newModel[prop] = obj[prop];

  }

  for(let prop in model) newModel[prop] = newModel[prop] != null ? newModel[prop] : model[prop];

  return newModel;

}

/**
 * Find a property with a string in its name
 * @param {Object} obj 
 * @param {String} check 
 * @param {Function} fn 
 * @return {Object} checked obj
 */
function deepObjFind(obj, check, fn){
  for(let prop in obj){
    if(typeof obj[prop] == 'object') deepObjFind(obj[prop], check, fn);
    else if(prop.toLowerCase().includes(check)) fn(obj, prop); 
  }
  return obj;
}

/**
 * Compare a object to a model, cast the property to the model type, assigns to an object
 * @param {Object} obj 
 * @param {Object} model
 * @param {Object} [model.core]
 * @param {Object} [model.basic]
 * @param {Object} [assign]
 * @return {Object} assign
 */
function deepObjCastingSet(obj, model, assign = {}){

  var propsModel = model.core ? { ...model.core, ...model.basic } : model;

  for(let prop in obj){

    //Check core properties
    if(model.core && Object.keys(model.core).includes(prop) && 
        (obj[prop] === '' || obj[prop] == null || 
          (typeof propsModel[prop] == 'number' && isNaN(obj[prop])))) throw new Error(`Invalid ${prop || 'data'}`);

    //If property doesn´t exists in model, then deletes it
    if(propsModel[prop] == null){
      delete obj[prop];
      continue;
    }

    //Casts the type, keeps it if is an array
    switch(typeof propsModel[prop]){ 
      case 'number':
        obj[prop] = Number(obj[prop]);
        break;
      case 'boolean':
        obj[prop] = toBoolean(String(obj[prop]));
        break;
      case 'string':
        obj[prop] = String(obj[prop]);
        break;
      case 'object':
        if(prop.toLowerCase().includes('date')){
          obj[prop] = new Date(obj[prop]);
        } else if(Object.keys(propsModel[prop]).length) deepObjCastingSet(obj[prop], propsModel[prop], obj[prop]);
        break;
      default:
        break;
    }

    assign[prop] = obj[prop];

  }

  return assign;

}

//Helper functions

/**
 * 
 * @param {String} target 
 * @return {Boolean}
 */
function toBoolean(target){

  var converted = target.toLowerCase();

  switch(converted){
    case '0':
    case '-0':
    case 'false':
    case 'null':
    case 'undefined': 
    case 'nan':
      converted = false;
      break;

    default: 
      break;
  }

  return Boolean(converted);

};
