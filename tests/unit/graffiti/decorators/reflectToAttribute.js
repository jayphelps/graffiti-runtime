import { expect } from 'chai';
import reflectToAttribute from '../../src/graffiti/decorators/reflectToAttribute';

describe('reflectToAttribute', () => {

  it('Example#isExampleClass is true', () => {
    var example = new Example();
    expect(example.isExampleClass).to.equal(true);
  });
  
});