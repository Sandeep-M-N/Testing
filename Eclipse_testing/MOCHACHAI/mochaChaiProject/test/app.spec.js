const{add,sub,mul,div}=require('../src/app')
// const expect = require('chai').expect
//for TDD we need to import
const{suite,test}=require('mocha')
let expect;
(async ()=>{
    const chai = await import('chai'); // importing chai explicitly
    expect = chai.expect;
})();
//1.BDD - 'describe' and 'it'

context('suite 1', ()=>{
    specify('add(2,3) should return 5',()=>{  // by using BDD = context & specify
        expect(add(4,3)).to.be.equal(7);
    })
})

suite('suite2',()=>{
    test('sub(5,10) should return 5',()=>{   // by using TDD
        expect(sub(5,10)).to.be.equal(5)
    })
})
describe('suite3',()=>{
    it('mul(5,5) should return 25',()=>{   // by using BDD= describe & it
        expect(mul(5,5)).to.be.equal(25)
    })
})

