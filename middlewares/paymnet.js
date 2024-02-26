var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var microtime = require('microtime');
var crypto = require('crypto');
var app = express();
var nodeBase64 = require('nodejs-base64-converter');
var request = require('request');
var path = require('path');

const User = require('../models/user');

module.exports = async (req, res, next) => {

};