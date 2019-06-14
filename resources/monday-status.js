let id = ''

const mondayStatusUpdate = (z, bundle) => {
  z.console.log('hello from a console log!');
  
  let pageNumber = 1
  let id = ""
  email = "email@email.com"
    const findId = ((board_id, pageNumber, z, bundle) => {
    z.request({
        method: 'GET',
        url: `https://api.monday.com:443/v1/boards/${board_id}/pulses.json?per_page=25&page=${pageNumber}&api_key=0a373e1e29ff5f2b0fc83444259b1096`,  
        //${bundle.inputData.board_id}
        //${pageNumber}
        // board_id = 245325665
    })
  })

    /* original http call
    const emailPromise = z.request({
      method: 'GET',
      url: `https://api.monday.com:443/v1/boards/245325665/pulses.json?per_page=25&api_key=0a373e1e29ff5f2b0fc83444259b1096`,  
      //${bundle.inputData.board_id}
      //${pageNumber}
    })
  */
  while(id === '') {
    console.log("while if happening")
    emailPromise = findId(245325665, pageNumber, z, bundle)

    emailPromise.then((response) => {
      console.log("We are looking at the promise")
      if (!response.json[0]) {
        console.log("There is no user with the given email address")
      } 
    /*
      if (response) {
        pageNumber = pageNumber + 1
      }*/
      else {
        const mondayUsers = response.json
        for (mondayUser of mondayUsers) {
          for (column of mondayUser.column_values) {
            if (column.title === "Email" && column.value !== null && column.value === "email6@email.com"/*bundle.inputFields.email*/ ) {
              id = mondayUser.pulse.id
              console.log(`First break, id found: ${id}`)
            }
          }
          if (id !== "") {
            console.log("Second break, id found")
            const promise = z.request({
              method: 'PUT',
              url: 'https://api.monday.com:443/v1/boards/245325665/columns/status8/status.json?color_index=12&pulse_id=245325668&api_key=0a373e1e29ff5f2b0fc83444259b1096'
            });
            return promise.then((response) => console.log(response.json));
          }
        }
        pageNumber = pageNumber + 1
      }
    });
  };

}

// status_id = status8 for "zapier test board", must be found by the zap

module.exports = {
  key: 'status',
  noun: 'Status',
  display: {
    label: 'Status Update',
    description: 'Updates a status in monday.com, given an email'
  },
  operation: {
    inputFields: [
      { key: 'email', type: 'string', required: true},
      { key: 'board_id', type: 'string', required: true},
      { key: 'column_id', type: 'string', required: true},
      { key: 'color_index', type: 'string', required: true},
    ],
    perform: mondayStatusUpdate,
    sample: {
      id: '',
      createdAt: '',
      name: '',
      authorId: '',
      directions: '',
      style: ''
    }
  }
};