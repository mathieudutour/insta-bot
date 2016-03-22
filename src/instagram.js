import request from 'request'
import fs from 'fs'

const {UUID, USER_AGENT, INSTAGRAM_SIGNATURE_KEY, INSTAGRAM_SIGNATURE_VERSION} = process.env

const URL = 'https://i.instagram.com/api/v1'

function send (method, resource, data, signed) {
  return new Promise((resolve, reject) => {
    const options = {
      url: URL + resource,
      method: method,
      headers: {
        'User-Agent': USER_AGENT
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
    'ig_sig_key_version': INSTAGRAM_SIGNATURE_VERSION,
    'signed_body': getSignature(dataString) + '.' + dataString
  }

  return require('querystring').stringify(post)
};

function getSignature (msg) {
  return require('crypto').createHmac('SHA256', INSTAGRAM_SIGNATURE_KEY).update(msg).digest('hex')
};

export function login (username, password) {
  return send('post', '/accounts/login/', {
    username,
    password,
    guid: UUID,
    device_id: 'android-' + UUID
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

export function like (mediaId) {
  return send('post', `/media/${mediaId}/like/`, {
    media_id: mediaId
  })
}

export function unlike (mediaId) {
  return send('post', `/media/${mediaId}/unlike/`, {
    media_id: mediaId
  })
}

export function comment (mediaId, commentText) {
  return send('post', `/media/${mediaId}/comment/`, {
    comment_text: commentText,
    media_id: mediaId
  })
}

export function userTimeline (user_id) {
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
