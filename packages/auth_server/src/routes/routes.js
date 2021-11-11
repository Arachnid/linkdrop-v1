const routes = {
  '/auth/nft': {
    post: {
      controller: 'authNftController',
      method: 'claim'
    }
  },
  '/get-link': {
    post: {
      controller: 'authTwitterController',
      method: 'claim'
    },
  },
  '/data': {
    post: {
      controller: 'authTwitterController',
      method: 'getdata'
    },
  },
  '/auth/check': {
    get: {
      controller: 'authTwitterController',
      method: 'check'
    },
  }, 
  '/auth/email': {
    post: {
      controller: 'authEmailController',
      method: 'claim'
    },
  },
  '/auth/check-email': {
    get: {
      controller: 'authEmailController',
      method: 'check'
    }        
  }
}


module.exports = routes
