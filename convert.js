const _ = require ('lodash');
const fg = require('fast-glob');
const fs = require('fs');
const xml2js = require('xml2js');
const moment = require('moment');
const sh = require('shorthash');
const path = require( 'path' );

let includes = fg.sync( ['./lib/*.js']);
for (let file of includes){
    require( path.resolve( file ) );
}