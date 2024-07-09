// const { beforeEach } = require('mocha');

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



})