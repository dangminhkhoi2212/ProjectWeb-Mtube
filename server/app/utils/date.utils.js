const getToDay = () => {
    var today = new Date();
    return today.toISOString();
};
module.exports = getToDay;
