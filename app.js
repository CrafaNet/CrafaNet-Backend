const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const dotenv = require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// CORS başlıklarını ekleyin
app.use(cors({
  origin: '*',
}));

app.use(express.static("public"));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// CONNECT MONGODB
mongoose.connect(`mongodb+srv://deniz:727302dk@clusterv1.voblqq1.mongodb.net/?retryWrites=true&w=majority&appName=ClusterV1`)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => {
    console.error('DB Connection Error:', err);
  });

app.use(cookieParser());

app.use(session({
  secret: 'exnoremo',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: `mongodb+srv://deniz:727302dk@clusterv1.voblqq1.mongodb.net/?retryWrites=true&w=majority&appName=ClusterV1` }),
}));

app.use(function (req, res, next) {
  res.locals.req = req;
  res.locals.res = res;
  req.url = `${req.body.api}`; 
  token = req.session.token;
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

