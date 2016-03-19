import request from 'request'
import fs from 'fs'

const URL = 'https://i.instagram.com/api/v1'
const key = 'b4a23f5e39b5929e0666ac5de94c89d1618a2916'
const uuid = '78791800-eb02-11e5-a03b-5cf9388caf78'
const userAgent = 'Instagram 4.1.0 Android (11/2.4.2; 320; 720x1280; samsung; SM-N9000; SM-N9000; smdkc210; en_US)'

function send (method, resource, data, signed) {
  return new Promise((resolve, reject) => {
    const options = {
      url: URL + resource,
      method: method,
      headers: {
        'User-Agent': userAgent
      },
      jar: true
    }

    if (method.toLowerCase() !== 'get') {
      options.body = getSignedRequest(data)
    }

    if (resource === '/media/upload/') {
      options.formData = {}
      options.formData.device_timestamp = data.device_timestamp
      options.formData.photo = fs.readFileSync(data.photo)
    }

    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body || response)
      } else {
        reject(body || error)
      }
    })
  })
}

function getSignedRequest (data) {
  const dataString = JSON.stringify(data)
  const post = {
    'ig_sig_key_version': '4',
    'signed_body': getSignature(dataString) + '.' + dataString
  }

  return require('querystring').stringify(post)
};

function getSignature (msg) {
  return require('crypto').createHmac('SHA256', key).update(msg).digest('hex')
};

export function login (username, password) {
  return send('post', '/accounts/login/', {
    username,
    password,
    guid: uuid,
    device_id: 'android-' + uuid
  })
}

export function suggested () {
  return send('get', '/friendships/suggested/')
}

export function popular () {
  return send('get', '/feed/popular/')
}

export function getFollowers () {
  return send('get', '/friendships/followers/')
}

export function getFollowing () {
  return send('get', '/friendships/following/')
}

export function follow (user_id) {
  return send('post', '/friendships/create/' + user_id + '/', {
    user_id
  })
}

export function unfollow (user_id) {
  return send('post', '/friendships/destroy/' + user_id + '/', {
    user_id
  })
}

export function timeline () {

}

export function mediaLikes (mediaId) {
  return send('get', `/media/${mediaId}/likers/`)
}

export function mediaComments (mediaId) {
  return send('get', `/media/${mediaId}/comments/`)
}

export function user_timeline (user_id) {
  return send('get', '/feed/user/' + user_id)
}

export function upload (photo) {
  return send('post', '/media/upload/', {
    device_timestamp: Math.round(Date.now() / 1000),
    photo
  }, false)
}

export function configure (media_id, caption) {
  return send('post', '/media/configure/', {
    caption,
    device_timestamp: Math.round(Date.now() / 1000),
    source_type: 4,
    filter_type: 0,
    media_id
  })
}
