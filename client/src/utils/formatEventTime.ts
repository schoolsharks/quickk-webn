const formatEventTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const hoursStr = hours.toString().padStart(2, "0");
        const minutesStr = minutes.toString().padStart(2, "0");
        return `${hoursStr}:${minutesStr} ${ampm}`;
    };

    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
};

export default formatEventTime;