module.exports = {
    ui:'bdd',
    timeout:2000, // timeout after 2000 ms
    slow:150,
    reporter:'spec',
    retries:3,//(last precedence)testcase execution count , if it is 3,then testcase will
    ui:'bdd',
    'watch-files':['test/**/*.js'],

}