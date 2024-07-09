const axios = require('axios') // require for API testing

let expect;
(async ()=>{
    const chai= await import ('chai');
    expect = chai.expect;
})();
describe.skip('async test suite1',function(){
     // retry all tests in this suite upto 1 line
    it('promised based way',function(){
       
        return axios.get('http://localhost:8888/users').then(res=>{
            expect(res.data[1].useremail).to.be.equal('siva123@gmail.com')
            expect(res.data[1].username).to.be.equal('tempuser')
            expect(res.data[1].carname).to.be.equal('suzuki-nexa')
            expect(res.data[1].carprice).to.be.equal(8500)
        }).catch(err =>{
            console.log("error during test:",err)
            throw err;
        })
    })

})

