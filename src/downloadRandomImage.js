import fs from 'fs'
import request from 'request'

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

export function generateGuid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export default function (url) {
  const filename = generateGuid() + '.png'
  return new Promise((resolve, reject) => {
    console.log('Starting to download ' + url)
    request(url)
      .pipe(
        fs.createWriteStream(filename)
        .on('error', (err) => {
          reject(err)
        })
      )
      .on('close', () => {
        console.log('Downloaded ' + url + ' to ' + filename)
        resolve(filename)
      })
  })
}
