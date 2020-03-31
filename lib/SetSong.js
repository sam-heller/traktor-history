class SetSong extends Base {
    static async fromNML(raw){
        try {
            const songData = await this.parseNML(raw);
            return new SetSong(songData);
        } catch (e){
            console.log("faild parsing", e);
            console.log(JSON.stringify(raw), "\n\n ");
        }
    }

    static async parseNML(raw){
        let data = {};
        if (_.includes(['TRACK', 'STEM'], raw.PRIMARYKEY[0].$.TYPE)){
            data.type = _.lowerCase(raw.PRIMARYKEY[0].$.TYPE);
            if (data.type == 'track') data.track = raw.PRIMARYKEY[0].$.KEY.split('/:').pop();
            data.deck = raw.EXTENDEDDATA[0].$.DECK;
            data.playTime = this.secondsToTime(raw.EXTENDEDDATA[0].$.DURATION, "mm:ss");
            data.startDate = raw.EXTENDEDDATA[0].$.STARTDATE;
            data.startTime = this.secondsToTime(raw.EXTENDEDDATA[0].$.STARTTIME, "HH:mm");
        } else {
            console.log('Unknown Track Type', JSON.stringify(raw));
        }
        return data;
    }
}
module.exports = SetSong;