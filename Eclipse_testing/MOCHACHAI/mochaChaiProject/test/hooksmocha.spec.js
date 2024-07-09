const{add,sub,mul,div}=require('../src/app')
let expect;
(async ()=>{
    const chai = await import('chai'); // importing chai explicitly
    expect = chai.expect;
})();

//const expect = require('chai').expect

describe('HooksSuite 1',()=>{
    before(()=>{
        console.log('before')
    });

    after(()=>{
        console.log('after')
    });
    beforeEach(()=>{
        console.log('beforeEach')
    });
    afterEach(()=>{
        console.log('afterEach')
    });
    describe('suite3',()=>{
        it('mul(5,5) should return 25',()=>{   // by using BDD= describe & it
            expect(mul(5,5)).to.be.equal(25)
        })
    })
    



})
