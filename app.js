const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const dotenv = require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// CORS başlıklarını ekleyin
app.use(cors({
  origin: '*',
}));

app.use(express.static("public"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(function (req, res, next) {
  res.locals.req = req;
  res.locals.res = res;
  req.url = `${req.body.api}`;
  next();
});

app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);



// ROUTES
const routes = require('./routes/main');
app.use('/', routes);

app.listen(process.env.PORT || 5050, '0.0.0.0', () => {
  console.log(`App is running on port ${process.env.PORT || 5050}`);
});
