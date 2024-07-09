// task1 
console.log('task 1');
 //Task 2
//  setTimeout(()=>{
//     console.log('task2')
//  },"1000");
 //task 3
 console.log('task3');
 //task 4
 console.log('task 4');

 function resolveAfter1Second(){
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve('resolved')
            // console.log('resolved')
        },"1000")
    })
 }
 resolveAfter1Second().then(value =>{

    console.log(value);
    setTimeout(()=>{
        Promise.resolve('resolve after 2 seconds');
    },500)
 }).then(value =>{
    console.log(value)
 })

 