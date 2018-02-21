#!/usr/bin/env node

var express = require('express')
var cors    = require('cors')
var app     = express()

// Enable compression on responses
app.use(require('compression')())

// Enable CORS
app.use(cors())

// Example backend implementation
app.get("/api/data", function(req, res) {
  res.json({ message: "Hello, world!" })
})

// Start the server
app.listen(3000)

console.log("Listening for requests on ports 3000, 3001\n")
