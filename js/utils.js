function getGroupInterval(n, interval) {
    var start = Math.floor(n / interval) * interval;
    var end = start + interval;
    return {
        start: start,
        end: end
    };
}
