const axios = require('axios') // require for API testing

let expect;
(async ()=>{
    const chai= await import ('chai');
    expect = chai.expect;
})();

describe('async test suite1',function(){
    this.retries(1); // retry all tests in this suite upto 1 line
    it('promised based way',function(){
        this.retries(3);
        return axios.get('http://localhost:8888/users').then(res=>{
            expect(res.data[1].useremail).to.be.equal('siv123@gmail.com')
            expect(res.data[1].username).to.be.equal('tempuser')
            expect(res.data[1].carname).to.be.equal('suzuki-nexa')
            expect(res.data[1].carprice).to.be.equal(8500)
        }).catch(err =>{
            console.log("error during test:",err)
            throw err;
        })
    })

})

// describe('async test suite1',function(){
//     this.retries(3); // retry all tests in this suite upto 1 line
//     it('promised based way',function(){
//         this.retries(3);
//         return axios.get('https://reqres.in/api/users?page=2').then(res=>{
//             expect(res.data.data[1].email).to.be.equal('lindsay.erguson@reqres.in')
            
//         }).catch(err =>{
//             console.log("error during test:",err)
//             throw err;
//         })
//     })

// })

