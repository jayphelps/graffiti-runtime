import { expect } from 'chai';
import reflectToAttribute from '../../../../src/graffiti/decorators/reflectToAttribute';
var setAttributeArgs, removeAttributeArgs;

class HTMLElement {
  setAttribute() {
    setAttributeArgs = arguments; // replace with spies
  }
  removeAttribute() {
    removeAttributeArgs = arguments; // replace with spies
  }
}

class MyCounterComponent extends HTMLElement {
  @reflectToAttribute()
  counter = 0;

  events = {
    increment() {
      this.counter++;
      console.log(this.counter);
    }
  }
}

describe('reflectToAttribute', () => {
  setAttributeArgs = undefined;
  removeAttributeArgs = undefined;
  it('should set the correct value for the given key', () => {
    var cc = new MyCounterComponent();
    expect(cc.counter).to.equal(0);
  });

  it('should set attribute', function() {
    var cc = new MyCounterComponent();
    cc.events.increment.bind(cc)();
    expect(cc.counter).to.equal(1);
    expect(setAttributeArgs['0']).to.equal('counter');
    expect(setAttributeArgs['1']).to.equal('1');
  });

  it('should set values independently for separate component instances', function() {
    var cc1 = new MyCounterComponent();
    var cc2 = new MyCounterComponent();
    expect(cc1.counter).to.equal(0);
    cc2.events.increment.bind(cc2)();
    cc2.events.increment.bind(cc2)();
    expect(cc2.counter).to.equal(2);
    expect(cc1.counter).to.equal(0);
  });

  it('should remove attribute for an undefined value', function() {
    var cc = new MyCounterComponent();
    cc.counter = undefined;
    expect(removeAttributeArgs['0']).to.equal('counter');
  });

});