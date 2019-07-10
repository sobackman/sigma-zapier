let counter = 1
user = {}
users = []

const mondayUpdatedPulses = (z, bundle) => {
  z.console.log('hello from a console log!');
  const promise = z.request({
    method: 'GET',
    url: `https://api.monday.com:443/v1/boards/${bundle.inputData.board_id}/pulses.json?page=${counter}&per_page=25&order_by=updated_at_desc`,
    //url: `https://api.monday.com:443/v1/boards/245325665/pulses.json?page=${counter}&per_page=5&order_by=updated_at_desc&api_key=0a373e1e29ff5f2b0fc83444259b1096`,  
  })

  return promise.then((response) => {
    if (!response.json[0]) {
      return users
    }
    const mondayUsers = response.json
    for (mondayUser of mondayUsers) {
      user.name = mondayUser.pulse.name
      user.id = mondayUser.pulse.id
      user.pulse_id = mondayUser.pulse.id
      for (column of mondayUser.column_values) {
        switch (column.title) {
          case 'Status': 
            if (column.value !== null) {
               user.status = column.value.index
               if (column.value.changed_at && column.value.changed_at !== null) {
                user.id = user.id + column.value.changed_at 
               }
            }
            break
          case 'Email':
            if (column.value !== null) {
              user.email = column.value
            }
            break
          default:
            break 
        }
      }
      users.push(user)
      user = {}
    }
    // Two pages of pulses have been collected from monday.com
    if( counter === 2 ) {
      return users
    }
    else {
      counter++
      // Collect a second page of pulses from monday.com
      return mondayUpdatedPulses(z, bundle)
    }
  }) 
};

module.exports = {
  key: 'pulses', 
  noun: 'Updated Pulses',
  display: {
    // What the user will see in the Zap Editor when selecting an action
    label: 'Updated Pulse Values',
    description: 'Gets the 50 most recently updated pulses belonging to a board'
  },
  operation: {
    inputFields: [
      {
        key: 'board_id',
        label: 'Board ID',
        required: true
      },
    ],
    perform: mondayUpdatedPulses,
    sample: {
      "id": 1,
      "puls_id": 1,
      "name": "name",
      "email": "someemail@mail.com",
      "status": "status",
    }
  }
};