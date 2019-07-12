const search = require('./searches/monday-search')
const updatedpulses = require('./triggers/updatedpulses')

const addApiKeyToHeader = (request, z, bundle) => {
  request.params.api_key = bundle.authData.apiKey
  return request
}

// We can roll up all our behaviors in an App.
const App = {
  authentication: {
    type: 'custom',
    fields: [
      {key: 'apiKey', type: 'string'}
    ],
    test: (z, bundle) => {
      const promise = z.request('https://api.monday.com/me')
      return promise.then((response) => {
        console.log(`A response: ${response}`)
        if (response.status !== 200) {
          throw new Error('Invalid API Key')
        }
      })
    }
  },
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    // Comment out this variable (and use the alternate url in the trigger and search) to enable local testing
    // This variabels enables dynamic fetching of the Monday API key 
    addApiKeyToHeader
  ],

  afterResponse: [
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {

  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [updatedpulses.key]: updatedpulses
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    [search.key]: search
  },

  // If you want your creates to show up, you better include it here!
  creates: {
  }
};

// Finally, export the app.
module.exports = App;
