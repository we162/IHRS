const generateEndTime = (startTime, slots) => {

let [hours, minutes] = startTime.split(":").map(Number);

let totalMinutes = hours * 60 + minutes;

let duration = slots * 45;

let end = totalMinutes + duration;

let endHour = Math.floor(end / 60);
let endMin = end % 60;

return `${endHour}:${endMin.toString().padStart(2,"0")}`;
};

module.exports = generateEndTime;