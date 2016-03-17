import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Bot working.')
})
app.set('port', process.env.PORT || 5000)
app.listen(app.get('port'), () => {
  console.log('Listening on port', app.get('port'))
})
