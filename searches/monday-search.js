let page = 1
let result = []
let user = {
  name: '',
  email: '',
  pulse_id: '',
  board_id: '' 
}

const mondaySearch = (z, bundle) => {
    const promise = z.request({
        method: 'GET',
        url: `https://api.monday.com:443/v1/boards/${bundle.inputData.board_id}/pulses.json?per_page=25&page=${page}`,
        // url for local testing. Also comment out variable in index.js 
        //url: `https://api.monday.com:443/v1/boards/245325665/pulses.json?page=${page}&per_page=2&api_key=0a373e1e29ff5f2b0fc83444259b1096`,
        
    })

    return promise.then(response => {
        if (!response.json[0]) {
          result.push(user)
          return result
        } 
        else { 
            const mondayUsers = response.json
                mondayUsers: 
                for (mondayUser of mondayUsers) {
                    for (column of mondayUser.column_values) {
                        //if (column.title === "Email" && column.value !== null && column.value === bundle.inputData.email) {
                        if (column.title === "Email" && column.value !== null && column.value === 'email5@email.com') {
                          user.pulse_id = mondayUser.pulse.id
                            user.email = bundle.inputData.email
                            user.board_id = bundle.inputData.board_id
                            result.push(user)
                            z.console.log(`Type of: ${result.typeOf}`)
                            return result
                        }
                    }
                }
                page = page+1
                return mondaySearch(z, bundle)
        }
    })
}

module.exports = {
    key: 'pulse',
  
    // You'll want to provide some helpful display labels and descriptions
    // for users. Zapier will put them into the UX.
    noun: 'Pulse',
    display: {
      label: 'Find a Pulse',
      description: 'Search for pulse by email.'
    },
  
    // `operation` is where we make the call to your API to do the search
    operation: {
      // This search only has one search field. Your searches might have just one, or many
      // search fields.
      inputFields: [
        { key: 'email', label: 'Email', type: 'string', required: true},
        { key: 'board_id', label: 'Board Id', type: 'string', required: true},
        // Example input:
        //   key: 'style',
        //   type: 'string',
        //   label: 'Style',
        //   helpText: 'Cuisine style to limit to the search to (i.e. mediterranean or italian).'
      ],
      perform: mondaySearch,
      
      // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
      // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
      // returned records, and have obviously dummy values that we can show to any user.
      sample: {
        email: 'email@email.com',
        id: '123',


        // Example data
        // id: 1,
        // createdAt: 1472069465,
        // name: 'Best Spagetti Ever',
        // authorId: 1,
        // directions: '1. Boil Noodles\n2.Serve with sauce',
        // style: 'italian'
      },
  
      // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
      // field definitions. The result will be used to augment the sample.
      // outputFields: () => { return []; }
      // Alternatively, a static field definition should be provided, to specify labels for the fields
      outputFields: [
        {key: 'email', label: 'Email'},
        {key: 'pulse_id', label: 'Pulse Id'},
        {key: 'board_id', label: 'Board Id'}
       
        // Example output
        // {key: 'id', label: 'ID'},
        // {key: 'createdAt', label: 'Created At'},
        // {key: 'name', label: 'Name'},
        // {key: 'directions', label: 'Directions'},
        // {key: 'authorId', label: 'Author ID'},
        // {key: 'style', label: 'Style'}
      ]
    }
  };