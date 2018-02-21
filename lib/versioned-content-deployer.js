const fs = require('fs')
const url = require('url')
const mime = require('mime')
const http = require('http')

module.exports = function deployFiles (dir, files, version, location, log) {
  if (!dir.endsWith('/')) dir += '/'

  const fileToObject = file => ({
    resource: file.substring(dir.length),
    name: file,
    size: fs.statSync(file).size,
    contentType: mime.getType(file),
  })

  const uploadFileObject = file => new Promise((resolve, reject) => {
    const opts = url.parse(location + file.resource)
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
  .then(file => log(location + file.resource, file.contentType, []))

  return Promise.all(files
    .map(fileToObject)
    .map(uploadFileObject)
  )
}
