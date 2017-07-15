var downloader = require('..')

const urlPattern = 'http://www.usma.edu/dep/shared%20documents/daw-june2011.pdf'
const from = 1
const to = 1

downloader.start(urlPattern, from, to)
