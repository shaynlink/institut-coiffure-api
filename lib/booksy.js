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
            'x-api-key': 'web-e3d812bf-d7a2-445d-ab38-55589ae6a121',
            'x-fingerprint': '765b4031-6a36-4912-a27f-a998d2f9a29b',
            'x-user-pseudo-id': '689776874.1683058369',
            'x-app-version': '3.0',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        }
    })
    .then(({ data }) => data)
    .catch(() => ({ status: 'fail'}))
}

module.exports.getMedia = getMedia;