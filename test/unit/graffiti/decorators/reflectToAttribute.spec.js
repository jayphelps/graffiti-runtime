import { expect } from 'chai';
import reflectToAttribute from '../../../../graffiti/decorators/reflectToAttribute';
import { spy } from 'sinon';

var initializerCallCount = 0;

class MockHTMLElement {
  constructor() {
    this.setAttribute = spy();
    this.removeAttribute = spy();
  }
}

class MyCounterComponent extends MockHTMLElement {
  @reflectToAttribute()
  counter = (function () {
    initializerCallCount++;
    return 0
  })();

  events = {
    increment() {
      this.counter++;
    }
  }
}

describe('reflectToAttribute', function () {
  afterEach(function () {
    initializerCallCount = 0;
  });

  it('should set the correct value for the given key', function () {
    var cc = new MyCounterComponent();
    expect(cc.counter).to.equal(0);
    expect(initializerCallCount).to.equal(1);
  });

  it('should set attribute', function () {
    var cc = new MyCounterComponent();
    cc.events.increment.bind(cc)();
    expect(cc.counter).to.equal(1);
    expect(cc.setAttribute.calledWith('counter', '1')).to.be.true;
    expect(initializerCallCount).to.equal(1);
  });

  it('should set values independently for separate component instances', function () {
    var cc1 = new MyCounterComponent();
    var cc2 = new MyCounterComponent();
    expect(cc1.counter).to.equal(0);
    cc2.events.increment.bind(cc2)();
    cc2.events.increment.bind(cc2)();
    expect(cc2.counter).to.equal(2);
    expect(cc1.counter).to.equal(0);
    expect(initializerCallCount).to.equal(2);
  });

  it('should remove attribute for an undefined value', function () {
    var cc = new MyCounterComponent();
    cc.counter = undefined;
    expect(cc.removeAttribute.calledWith('counter')).to.be.true;
    expect(initializerCallCount).to.equal(0);
  });

});
