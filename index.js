const express = require('express')
const multer  = require('multer')
const adjustSRTFile = require('./src/adjuster/srt');

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
  adjustSRTFile(req.file.filename, (file, cb) => {
    res.download(file, cb);
  })
}
)

app.listen(PORT, () => { console.log(`Example app listening on port ${PORT}..`) } )