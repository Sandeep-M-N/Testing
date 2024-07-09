// const expect = require('chai').expect;
const axios = require('axios') // require for API testing

let expect;
(async ()=>{
    const chai= await import ('chai');
    expect = chai.expect;
})();


describe('async test suite1',()=>{
    it('promised based way',()=>{
        return axios.get('http://localhost:8888/users').then(res=>{
            expect(res.data[1].useremail).to.be.equal('siva123@gmail.com')
            expect(res.data[1].username).to.be.equal('tempuser')
            expect(res.data[1].carname).to.be.equal('suzuki-nexa')
            expect(res.data[1].carprice).to.be.equal(8500)
        })
    })


    it('done based way',(done)=>{
        axios.get('http://localhost:8888/users').then(res=>{
            expect(res.data[2].username).to.be.equal('eeswaran')
            done()
        }).catch(err =>{
            done(err)
        })
});

    it('aync await based way',async()=>{
        const res = await axios.get('http://localhost:8888/users')
        expect(res.data[1].username).to.be.equal('tempuser')
        
});



})
