// import {typeCheck} from '../lib/core/utils.js';
import {Enums} from '../lib/core/blueprint.js';

describe('sum module', () => {
  test('current directory', () => {
    const en = new Enums('Kg,g');
    // console.log(typeCheck('{}'));
    expect(en.getScript()).toBe('Kg,');
  });
});
