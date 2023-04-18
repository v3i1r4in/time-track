export function parseDuationMinutesInternal(durationStr) {
    const regex = /(\d+)([hm])/g;
    let match;
    let totalMinutes = 0;

    while ((match = regex.exec(durationStr)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 'h':
                totalMinutes += value * 60;
                break;
            case 'm':
                totalMinutes += value;
                break;
        }
    }
    
    return totalMinutes;
}

export function parseDurationMinutes(durationStr) {
    if (/^(\d+h)?(\d+m)?$/g.test(durationStr) === false) throw new Error('Invalid duration string: ' + durationStr);
    const minutes = parseDuationMinutesInternal(durationStr);
    return minutes;
}

export function unparseDurationMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    minutes = Math.floor(minutes % 60);
    let result = '';
    if (hours) result += `${hours}h`;
    if (minutes) result += `${minutes}m`;
    return result;
}