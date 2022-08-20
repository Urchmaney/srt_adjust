const convertTimeToSeconds = (time) => {
  const splttedTime = time.split(':');
  return (60 * 60 * Number(splttedTime[0])) + (60 * Number(splttedTime[1])) + Number(splttedTime[2]);
}


const subtractTime = (time1, time2) => {
  if (!time1 || !time2) return 0

  return convertTimeToSeconds(time2) - convertTimeToSeconds(time1)
}

module.exports = {
  subtractTime
}