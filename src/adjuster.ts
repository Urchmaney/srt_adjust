export const adjustTimeLine = (line: string, interval: number, forward: boolean) : string => {
  const regex = /^\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}$/;
  if (!regex.test(line)) return line.trim();

  let newLine: string[] = []
  line.split('-->').forEach((val) => {
    const commaSplitted = val.split(',');
    const colonSplitted = commaSplitted[0].split(":");
    let toAdd = interval;
    let i = 2;
    while (i > 0) {
      if (forward) {
        const total = Number(colonSplitted[i]) + toAdd
        colonSplitted[i] = ((total % 60) < 10) ? `0${total % 60}` : total.toString();

        toAdd = Math.floor(total / 60)
      } else {
        const remainder = Math.floor(toAdd % 60)
        toAdd = Math.floor(toAdd / 60)
        const currentVal = Number(colonSplitted[i])
        const val = currentVal >= remainder ? currentVal - remainder : (60 - (remainder - currentVal))
        colonSplitted[i] = (val < 10) ? `0${val}` : val.toString();
        if (currentVal < remainder) toAdd += 1
      }
      i -= 1
    }
    if (toAdd > 0) colonSplitted[0] = (forward ? (Number(colonSplitted[0]) + toAdd) : (Number(colonSplitted[0]) - toAdd)).toString()
    newLine.push(`${colonSplitted.join(":")},${commaSplitted[1]}`);
  })

  return newLine.join('-->').trim();
}


// const adjustSRTFile = (path, interval, forward, cb) => {
//   const rd = readline.createInterface({
//     input: fs.createReadStream(`tmp/${path}`),
//     console: false
//   });

//   const newPath = `tmp/new_${path}`
//   const wd = fs.createWriteStream(newPath);
//   rd.on('line', function (line) {
//     const newLine = adjustTimeLine(line, interval, forward);
//     wd.write(`${newLine}\n`)
//   }).on('close', () => {
//     cb(newPath, () => { fs.unlinkSync(newPath) });
//     fs.unlinkSync(`tmp/${path}`);
//   })
// }

// module.exports = adjustSRTFile;
