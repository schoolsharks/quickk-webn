import moment from 'moment';

export const extractTimeAndDate = (isoDateString: string) => {
    const date = moment.utc(isoDateString); // parse string as UTC, do not use moment()
    return {
        time: date.format('HH:mm:ss'),   // "21:00:00"
        date: date.format('Do MMMM')     // "6th June"
    };
};

export const extractTimeInAmPm = (isoDateString: string) => {
    const date = moment.utc(isoDateString);
    return date.format('hh:mm A'); // e.g., "09:00 PM"
};

export const extractFullDateWithDay = (isoDateString: string) => {
    const date = moment.utc(isoDateString);
    return date.format('dddd, Do MMMM YYYY'); // e.g., "Saturday, 18th October 2025"
};