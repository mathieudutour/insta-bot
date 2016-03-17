import fs from 'fs'
import request from 'request'
import {generateGuid} from './utils'

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
