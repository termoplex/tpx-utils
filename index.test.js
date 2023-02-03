/* eslint-disable no-undef */
global.NOCONSLOG = true;

//Dependencies
const { expect } = require('chai'),

//App modules
  objUtils = require('./index.js');

describe('utils/object Test', () => {
  
  it('Main', () => {
    expect(objUtils).to.be.a('object');
    expect(objUtils).to.have.property('deepObjSet');
    expect(objUtils).to.have.property('deepObjFind');
    expect(objUtils).to.have.property('deepObjCastingSet');
  });

  it('deepObjCastingSet', () => {
    
    var assign = {};

    objUtils.deepObjCastingSet(
      {
        test1: 1,
        test2: '2',
        test3: true,
        test4: 'false',
        test5: 'test5',
        test6: 'test6'
      }, 
      {
        test1: 0,
        test2: 0,
        test3: true,
        test4: true, 
        test5: ''
      },
      assign
    );
    
    expect(assign).to.have.property('test1');
    expect(assign).to.have.property('test2');
    expect(assign).to.have.property('test3');
    expect(assign).to.have.property('test4');
    expect(assign).to.have.property('test5');
    expect(assign).not.to.have.property('test6');

    expect(assign.test1).to.be.a('number');
    expect(assign.test2).to.be.a('number');
    expect(assign.test3).to.be.a('boolean');
    expect(assign.test4).to.be.a('boolean');
    expect(assign.test5).to.be.a('string');

  });

  it('deepObjCastingSet with core/basic', () => {
    
    var assign = {};

    objUtils.deepObjCastingSet(
      {
        test1: 1,
        test2: '2'
      }, 
      {
        core: { test1: 0 },
        basic: { test2: 0 }
      },
      assign
    );

    expect(assign).to.have.property('test1');
    expect(assign).to.have.property('test2');

    expect(assign.test1).to.be.a('number');
    expect(assign.test2).to.be.a('number');

  });

  it('deepObjCastingSet invalid data', (done) => {
    
    var assign = {};

    try {
      objUtils.deepObjCastingSet(
        { test1: '' }, 
        { core: { test1: '' } },
        assign
      );
    } catch (e) { testError(e, 'Invalid test1') && done(); }
    
  });

  it('deepObjFind', () => {
    var obj = {
      test1: 1,
      test2: {
        test3: {
          deep: 1 
        }
      }
    },
    
    found = objUtils.deepObjFind(obj, 'deep', (obj, prop) => {
      expect(obj).to.have.property(prop);
      expect(obj[prop]).to.be.equal(1);
      expect(String(prop)).to.be.equal('deep');
    });

    expect(found).to.be.equal(obj);
  });

  it('deepObjSet', () => {
    var model = {
      test1: 1,
      test2: {
        test3: {
          deep: 1
        }
      }
    },

    obj = {
      test2: {
        test3: {
          deep: 2,
          deep1: 3
        }
      }
    },

    setted = objUtils.deepObjSet(obj, model);

    expect(setted).to.be.a('object');
    expect(setted).to.have.property('test1');
    expect(setted.test1).to.be.equal(1);
    expect(setted).to.have.property('test2');
    expect(setted.test2).to.be.a('object');
    expect(setted.test2).to.have.property('test3');
    expect(setted.test2.test3).to.be.a('object');
    expect(setted.test2.test3).to.have.property('deep');
    expect(setted.test2.test3.deep).to.be.equal(2);
    expect(setted.test2.test3).to.have.property('deep1');
    expect(setted.test2.test3.deep1).to.be.equal(3);

  });

});


//Helper functions

/**
 * @param {Object} error
 * @param {String} message
 * @param {Number} [errorCode]
 */
function testError(e, errorMessage, errorCode) {
  
  if(errorCode) {
    
    deepObjTest(e, { 
      body: {
        name: '',
        message: ''
      },
      status: 0
    });
    expect(e.body.message).to.equal(errorMessage);
    expect(e.status).to.equal(errorCode);

  } else {

    expect(e).to.be.a('error');
    expect(e).to.have.property('message');
    expect(e.message).to.equal(errorMessage);

  }

  return true;

}

/**
 * @param {Object} obj object to test
 * @param {Object} model
 * @param {Boolean} equal
 */
function deepObjTest(obj, model, equal){

  expect(obj).to.be.a(typeof model);

  for(let prop in model){

    expect(obj).to.have.property(prop);

    if(obj[prop] instanceof Date || Array.isArray(obj[prop])){      
      expect(typeof obj[prop]).to.equal(typeof model[prop]);
    } else {
      expect(obj[prop]).to.satisfy((val) => typeof model[prop] == typeof val || ((prop.search(/date/i) != -1) && typeof val == 'string'));
      typeof obj[prop] == 'object' && deepObjTest(obj[prop], model[prop]);
    }

    if(equal && typeof model[prop] != 'object') expect(obj[prop]).to.equal(model[prop]);

  }

  return true;

}