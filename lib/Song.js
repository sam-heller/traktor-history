let Base = require('./Base');
let fg = require('fast-glob');
let _ = require ('lodash');
const fs = require('fs');
const xml2js = require('xml2js');
const moment = require('moment');
const sh = require('shorthash');

class Song extends Base {
    static async fromNML(raw){
        try {
            const songData = await this.parseNML(raw);
            return new Song(songData);
        } catch (e){
            console.log("faild parsing", e);
            console.log(JSON.stringify(raw));
            console.log('');
        }
        
    }

    static async parseNML(raw){
        let data = {};
        if (_.isUndefined(raw.$.AUDIO_ID)) {
            data.id = sh.unique(JSON.stringify(raw.$));
        } else {
            data.id = sh.unique(raw.$.AUDIO_ID);
        }
        
        data.title = raw.$.TITLE;
        data.artist = raw.$.ARTIST;
        data.directory = raw.LOCATION[0].$.DIR;
        data.filename = raw.LOCATION[0].$.FILE;
        data.filenameKey = sh.unique(data.filename);
        
        if (!_.isUndefined(raw.TEMPO)){
            data.bpm = raw.TEMPO[0].$.BPM;
        }

        if (!_.isUndefined(raw.LOUDNESS)){
            data.peakDB = raw.LOUDNESS[0].$.PEAK_DB;
            data.percievedDB = raw.LOUDNESS[0].$.PERCEIVED_DB;
            data.analyzedDB = raw.LOUDNESS[0].$.ANALYZED_DB;
            data.musicalKey = raw.LOUDNESS[0].$.VALUE;    
        }

        let info = raw.INFO[0].$;
        data.bitrate = info.BITRATE;
        data.genre = info.GENRE;
        data.comment = info.COMMENT;
        data.key = info.KEY;
        data.playCount = info.PLAYCOUNT;
        data.color = info.COLOR;

        //Dodgy Data
        if (!_.isUndefined(raw.ALBUM)){
            data.album = raw.ALBUM[0].$.TITLE;
        }
        
        return data;
    }
}
module.exports = Song;