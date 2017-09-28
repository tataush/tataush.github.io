module.exports = {
    head: {
      link: [
        { href: 'https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.9/css/uikit.min.css', rel: 'stylesheet' },
        { href: '/css/main.css', rel: 'stylesheet' },
      ],
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js', type: 'text/javascript' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.9/js/uikit.js', type: 'text/javascript' }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'keywords', content: 'keyword 1, keyword 2'},
        { hid: 'description', name: 'description', content: 'This is the generic description.'}
      ]
    },
    build: {
      vendor: ['axios']
    }
  }