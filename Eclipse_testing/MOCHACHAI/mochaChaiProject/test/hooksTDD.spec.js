const {suite,test,setup,teardown,suiteSetup,suiteTeardown}=require('mocha')
suite('TDD hooks',()=>{
    suiteSetup(()=>{    // launch browser
        console.log('one suitesteup')
    });
    suiteTeardown(()=>{  // close browser
        console.log('one suiteteardown')
    });
    setup(()=>{  // login
        console.log('one setup')
    });
    teardown(()=>{   // logout
        console.log('one teardown')
    });
    //test cases
    test('add(7,3) should return 10', ()=>{
        console.log('one test')
    });
})