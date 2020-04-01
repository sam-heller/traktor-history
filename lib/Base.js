class Base {
    constructor(data){
        Object.assign(this, data);
    }

    static secondsToTime(seconds, format){
        return moment.utc(moment.duration(seconds * 1000).asMilliseconds()).format(format);
    }
}
module.exports = Base;