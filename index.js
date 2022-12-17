const express = require('express')
const multer  = require('multer')
const adjustSRTFile = require('./src/adjuster/srt');
const { subtractTime } = require('./src/util');

const app = express();
const PORT = 3000;

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'tmp/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.split('.srt')[0] + '-' + Date.now() + '.srt')
    }
  }),
  limits: { fileSize: 100000 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype == 'application/x-subrip') {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('Error Uploading File. Only .srt files are supported.'))
    }
  }
}).single('subtitle')

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/upload', (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(500)
      res.send({ error: err, msg: err.message })
    } else if (err) {
      res.status(400)
      res.send({ error: err, msg: err.message })
    } else {
      next();
    }
  })
}, (req, res) => {
  if(!req.query.interval && !(req.query.soundTime && req.query.subtitleTime)) {
    req.status(400)
    req.send({ error: 'Error with the query parameters!', msg: 'You need to supply an interval or a sound and subtitle time.' })
  }
  
  const parsedInterval = parseInt(req.query.interval);
  if (isNaN(parsedInterval) && !req.query.soundTime) {
    res.status(400);
    res.send({ error: 'Error with the interval value.', msg: 'The interval value must be a number.' })
  }

  const regex = /^\d{2}:\d{2}:\d{2}$/
  if (!req.query.interval && !(regex.test(req.query.soundTime && regex.test(req.query.subtitleTime)))) {
    req.status(400)
    req.send({ error: 'Error with the query sound time or subtitle time!', msg: 'The sound and subtitle time has to be in 00:00:00 format.' })
  }

  const subtracted = subtractTime(req.query.subtitleTime, req.query.soundTime);

  adjustSRTFile(req.file.filename, parsedInterval || subtracted, (req.query.forward.toLowerCase() != 'false'), (file, cb) => {
    res.download(file, cb);
  })
}
)

app.listen(PORT, () => { console.log(`Example app listening on port ${PORT}..`) } )