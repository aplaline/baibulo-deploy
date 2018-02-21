const fs = require('fs')
const url = require('url')
const mime = require('mime')
const http = require('http')

module.exports = function deployFiles (files, version, location, log) {
  const fileToObject = file => ({ name: file, size: fs.statSync(file).size, contentType: mime.getType(file) })

  const uploadFileObject = file => new Promise((resolve, reject) => {
    const opts = url.parse(location + file.name)
    opts.method = 'PUT'
    opts.headers = {
      'Version': version,
      'Content-Type': file.contentType,
      'Content-Length': file.size,
    }
    const req = http.request(opts, response => { file.response = response; resolve(file); })
    req.on('error', reject)
    fs.createReadStream(file.name).pipe(req)
  })
  .then(file => log(location + file.name, file.contentType, []))

  return Promise.all(files
    .map(fileToObject)
    .map(uploadFileObject)
  )
}
