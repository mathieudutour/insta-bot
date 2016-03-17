import express from 'express'
import Instagram from 'instagram-node'

const app = express()
const api = Instagram.instagram()
api.use({
  client_id: process.env.INSTAGRAM_CLIENT_ID,
  client_secret: process.env.INSTAGRAM_CLIENT_SECRET
})

const redirect_uri = process.env.HOST + '/handleauth'

app.get('/', function (req, res) {
  res.send('<a href="/instagram">instagram</a><a href="/twitter">twitter</a><a href="/facebook">facebook</a>')
})

app.get('/instagram', function (req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes', 'public_content', 'follower_list', 'comments', 'relationships'], state: 'a state' }))
})

app.get('/privacy', function (req, res) {
  res.send('Small personal app. Won\'t collect any data in you are not one of my personal account. Feel free to hit me with any question mat.dutour[at]gmail.com')
})

app.get('/handleauth', function (req, res) {
  api.authorize_user(req.query.code, redirect_uri, function (err, result) {
    if (err) {
      console.log(err.body)
      res.send("Didn't work")
    } else {
      console.log('Yay! Access token is ' + result.access_token)
      res.send('You are not one of my personal account. sorry.')
    }
  })
})

// import upload from './upload'
// import downloadRandomImage from './downloadRandomImage'
//
// const captionText = 'Test caption'
//
// const dimensions = process.env.IMAGE_DIMENSIONS || '400x400'
//
// const categories = [
//   'buildings',
//   'food',
//   'nature',
//   'people',
//   'technology',
//   'objects'
// ]
//
// const category = categories[Math.floor(Math.random() * categories.length)]
//
// downloadRandomImage(`https://source.unsplash.com/category/${category}/${dimensions}`)
//   .then((filename) => upload(filename, captionText))
//   .then((res) => console.log(res))
//   .catch((res) => console.log(res))

app.set('port', process.env.PORT || 5000)

app.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'))
})
