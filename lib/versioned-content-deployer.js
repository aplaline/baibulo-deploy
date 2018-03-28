const fs = require('fs')
const url = require('url')
const mime = require('mime')
const http = require('http')
const https = require('https')

/**
 * Define the chunk method in the prototype of an array
 * that returns an array with arrays of the given size.
 *
 * @param chunkSize {Integer} Size of every group
 */
Object.defineProperty(Array.prototype, 'chunk', {
  value: function(chunkSize) {
    return Array(Math.ceil(this.length/chunkSize)).fill().map((_,i) => this.slice(i*chunkSize,i*chunkSize+chunkSize));
  }
});

/**
 * Send files to remote machine using HTTP PUT
 *
 * @param {String} dir directory that the files are in
 * @param {Array} files list of files to send
 * @param {String} version version of files
 * @param {String} location location where to send the files
 * @param {Function} log a callback to call when a file is successfuly uploaded
 */
module.exports = function deployFiles (dir, files, version, location, method, ignored, log) {
  if (!dir.endsWith('/')) dir += '/'

  const fileToObject = file => ({
    resource: file.substring(dir.length).replace('\\', '/'),
    name: file,
    size: fs.statSync(file).size,
    contentType: mime.getType(file) || 'application/octet-stream',
  })

  const uploadFileObject = file => new Promise((resolve, reject) => {
    const opts = url.parse(location + file.resource)
    opts.method = method
    opts.headers = {
      'Version': version,
      'Content-Type': file.contentType,
      'Content-Length': file.size,
    }
    const protocol = opts.protocol === 'http:' ? http : https
    const req = protocol.request(opts, res => {
      file.response = res
      if (res.statusCode !== 201) {
        console.log('ERROR', opts.href)
        reject(res.statusMessage)
      } else {
        resolve(file)
      }
    })
    req.on('error', reject)
    fs.createReadStream(file.name).pipe(req)
  })

  const notifyFileUploaded = file => {
    log(location + file.resource, file.contentType, [ JSON.stringify(file.response.statusCode) ])
    return file
  }

  const uploadSingleFile = file => uploadFileObject(file).then(notifyFileUploaded)

  const uploadChunk = chunk => Promise.all(chunk.map(uploadSingleFile))

  const isIgnoredFile = file => ignored.findIndex(ignored => file.endsWith(ignored)) === -1

  return files
    .filter(isIgnoredFile)
    .map(fileToObject)
    .chunk(5) // upload max 5 files at once
    .reduce((acc, file) => acc.then(() => uploadChunk(file)), Promise.resolve())
}
