let Base = require('./Base');
let Song = require('./Song');

let Playlist = require('./Playlist');
let fg = require('fast-glob');
let _ = require ('lodash');
const fs = require('fs');
const xml2js = require('xml2js');
const moment = require('moment');
const sh = require('shorthash');


class Converter {
    async getCollections(collectionDir){
        let collections = fg.sync([collectionDir]);
        let current = [];
        for (let path of collections){
            let result = await this.parseDir(path);
            current.push(result);
        }
        return current;
    }

    async getHistory(historyDir){
        let records = fg.sync([historyDir]);
        let current = [];
        for (let path of records){
            result = await this.parseHistoryDir(path);
            current.push(result);
        }
        console.log(current);
    }    

    async parseDir(filepath){

        let data = fs.readFileSync(filepath, 'utf-8');
        let filename = filepath.split('/').pop();
        console.log(filepath, filename);
        let d = filename.match(/collection_(?<year>\d{4})y(?<month>\d{2})m(?<day>\d{1,2})d_(?<hour>\d{1,2})h(?<minute>\d{1,2})m(?<second>\d{1,2}).*/).groups;
        let created = moment().parseZone(`${d.year}-${d.month}-${d.day} ${d.hour}:${d.minute}:${d.second}-08:00`);

    
        const timestamp = created.unix();
        const date = created.format();
        var parser = new xml2js.Parser();
        var current;

         let lists = await parser.parseStringPromise(data)
            .then(async function (result) {
                
            let returnData = {playlists: [], songs: [], sets: []};
            let playlists = result.NML.PLAYLISTS[0].NODE[0].SUBNODES[0].NODE;
            for (let list of playlists){
                current = await Playlist.fromNML(list);
                current.dateSavedOn = {unix: timestamp, iso: date};
                returnData.playlists.push(current);
            }
    
            let songs = result.NML.COLLECTION[0].ENTRY;
            for (let song of songs){
                current = await Song.fromNML(song);
                current.dateSavedOn = {unix: timestamp, iso: date};
                returnData.songs.push(current);
            }
    
            let sets = result.NML.SETS;
            console.log(sets);
            return returnData;
        })
        .catch(function (err) {
            console.log(err);
        });
        return lists;
    
    }

    async parseHistoryDir(filepath){
        let data = fs.readFileSync(filepath, 'utf-8');
        var parser = new xml2js.Parser();
        lists = await parser.parseStringPromise(data)
        .then(async function (result) {
            let playlist = result.NML.PLAYLISTS[0].NODE[0].SUBNODES[0].NODE[0].PLAYLIST[0].ENTRY;
            let set = {};
            set.tracks = [];
            for (let entry of playlist){
                current = await SetSong.fromNML(entry);
                set.tracks.push(current);
            }
            return set;
        })
        .catch(function (err) {
            console.log(err);
        });
        return lists;    
    }    
}

module.exports = Converter;