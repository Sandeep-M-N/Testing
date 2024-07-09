const{areaOfCircle}=require('../src/app1')

let expect;
(async ()=>{
    const chai = await import('chai'); // importing chai explicitly
    expect = chai.expect;
})();

describe('suitearea',()=>{
    it('circle(10) should return 314',()=>{
        expect(areaOfCircle(10)).to.be.equal(314)
    })
})