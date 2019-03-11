const child_process = require("child_process");
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const graphqlExpress = require("express-graphql");
const bookSchema = require('./graphql/BookSchema').BookSchema;

var connectWithRetry = function() {
  return mongoose.connect('mongodb://mongo/fhir', function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithRetry();

app.set('port', (process.env.PORT || 4000));
app.listen(app.get('port'),  () =>{
    console.log("Node app is running at localhost:" + app.get('port'))
});

app.use('/graphql', graphqlExpress({
    schema: bookSchema,
    rootValue: global,
    graphiql: true
}));

app.get('/', (req, res) => {

    res.send("hello world ! ")

})
