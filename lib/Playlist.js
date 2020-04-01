let Base = require('./Base');
let fg = require('fast-glob');
let _ = require ('lodash');
const fs = require('fs');
const xml2js = require('xml2js');
const moment = require('moment');
const sh = require('shorthash');

class Playlist extends Base{

    static async fromNML(raw){
        const playlistData = await this.parseNML(raw);
        return new Playlist(playlistData);        
    }

    static async parseNML(raw){
        let data = {};
        data.type = _.lowerCase(raw.$.TYPE);
        data.name = raw.$.NAME;
        if (data.type == 'playlist'){
            if (raw.PLAYLIST[0].$.ENTRIES != 0){
                let current = raw.PLAYLIST[0].ENTRY[0].PRIMARYKEY[0].$;
                data.type = _.lowerCase(current.TYPE);
                data.key = current.KEY;
            }                    
        }
        return data;
    }
}
module.exports = Playlist;