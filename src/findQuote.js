import request from 'request'

export default function (category) {
  return (new Promise((resolve, reject) => {
    console.log('Starting to find quote ' + category)
    const url = `https://api.import.io/store/connector/_magic?url=http%3A%2F%2Fwww.goodreads.com%2Fquotes%2Ftag%2F${category}&format=JSON&js=false&_apikey=1ef1df9a4599474db4c5a1ee0bde9bd5b39f42f792a057b1a4a6a579e5ca176df5a933d74944c125e82d7c30f431977a347fd39924cd6d2a79787408a88c7509460ab61aec97cc2329fdb0176bdd28d7`

    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body)
      } else {
        reject(body || error)
      }
    })
  })).then((res) => JSON.parse(res).tables[0].results)
     .then((quotes) => quotes[Math.floor(Math.random() * quotes.length)])
     .then((quote) => quote.quotetext_content)
}
