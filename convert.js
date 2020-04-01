
let fg = require('fast-glob');
const path = require( 'path' );
const Converter = require('./lib/Converter')
let includes = fg.sync( ['./lib/*.js']);
for (let file of includes){require( path.resolve( file ) );}
async function run()
{
    let conv = new Converter();
    const collections = await conv.getCollections(__dirname +  '/data/collections/*');
    console.dir(collections);
    return collections;
}

run();