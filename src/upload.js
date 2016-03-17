import {exec} from 'child_process'
import fs from 'fs'

const {INSTAGRAM_USER, INSTAGRAM_PASSWORD} = process.env

export default function (filename, caption) {
  const command = `./pynstagram/__main__.py -u ${INSTAGRAM_USER} -p ${INSTAGRAM_PASSWORD} -f ${filename} -t '${caption}'`
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      try {
        fs.unlink(filename)
      } catch (e) {}
      if (error || stderr) {
        return reject(error || stderr)
      }
      console.log('uploaded ' + filename)
      resolve(stdout)
    })
  })
}
