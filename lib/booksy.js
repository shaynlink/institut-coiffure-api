const axios = require('axios');

function getMedia() {
   return axios.get('https://fr.booksy.com/api/fr/2/customer_api/images/21426', {
        params: {
            no_thumbs: true,
            category: 'inspiration',
            comments_size: 50,
            images_per_page: 100,
            page: 1
        },
        headers: {
            'x-api-key': process.env.API_KEY_BOOKSY,
            'x-fingerprint': process.env.FINGERPRINT_BOOKSY,
            'x-user-pseudo-id': process.env.APP_VERSION_BOOKSY,
            'x-app-version': '3.0',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        }
    })
    .then(({ data }) => data)
    .catch(() => ({ status: 'fail'}))
}

module.exports.getMedia = getMedia;