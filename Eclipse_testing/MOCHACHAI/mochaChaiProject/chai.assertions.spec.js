// const {expect,assert} = require('chai');
let expect;
(async ()=>{
    const chai= await import ('chai');
    expect = chai.expect;
})();

let assert;
(async ()=>{
    const chai= await import ('chai');
    assert = chai.assert;
})();
// const should = require('chai').should();

describe('chai Assertion',()=>{
    const a =20,
    arr= [30,40,50]
    obj = {name:'Sandeep',age:22},
    myFunc =(a,b) => a+b,
    isTrue=true,
    nan = NaN,
    myUndefined = undefined;


    it.only('Assert Style',()=>{
        assert.ok(true)
        assert.isOk('everything', 'everything is ok');
        assert.typeOf(arr, 'array');
        assert.include(arr,30,"30 isnt there in the array");
        assert.lengthOf(arr,3,"Length isnt 3");
        assert.deepEqual(arr,[30,40,50])
        // assert.equal(arr,[ 30, 40, 50 ])
        assert.sameOrderedMembers(arr,[30,40,50])
    });
})



// it('Expect Style',()=>{
//     expect(true).to.be.false;
//     expect(arr).to.be.a('array')
//     expect(arr).to.have.length(3);
//     expect(arr).to.eql(30,40,50);
//     expect(obj).to.have.keys(["name","age"]);
// });

// it('should Style', ()=>{
//     expect(true).to.be.true;
//     expect(arr).to.include(30);
// });