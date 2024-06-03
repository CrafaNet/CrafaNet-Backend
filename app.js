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

mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
.then(() => {
  console.log('Veritabanına bağlanıldı');
})
.catch((err) => {
  console.error('Veritabanı bağlanma hatası:', err);
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

app.listen(process.env.PORT || 2000, '0.0.0.0', () => {
  console.log(`App is running on port ${process.env.PORT || 2000}`);
});
