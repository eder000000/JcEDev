const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const whitelist = ['https://jce-demo-deploy-01.herokuapp.com','http://localhost:3000','https://jce-flask-02.herokuapp.com'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        if (whitelist.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/dist/JcEApp'));
app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+
'/dist/JcEApp/index.html'));});
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });