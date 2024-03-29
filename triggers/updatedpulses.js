let counter = 1
let user = {}
let users = []
let statusMatchPhrase = 'Status'
let returnUsers = []

const mondayUpdatedPulses = (z, bundle) => {
  const promise = z.request({
    method: 'GET',
    url: `https://api.monday.com:443/v1/boards/${bundle.inputData.board_id}/pulses.json?page=${counter}&per_page=25&order_by=updated_at_desc`,
    // url for local testing. Also comment out variable in index.js
    //url: `https://api.monday.com:443/v1/boards/195336180/pulses.json?page=${counter}&per_page=5&order_by=updated_at_desc&[API-KEY]`,  
  })

  return promise.then((response) => {
    if (bundle.inputData.status_column) {
      statusMatchPhrase = bundle.inputData.status_column
    }
    if (!response.json[0]) {
      saveAndReset()
      return returnUsers
    }
    const mondayUsers = response.json
    for (mondayUser of mondayUsers) {
      user.name = mondayUser.pulse.name
      // The id field is important for zapier to function properly. 
      // By checking the id zapier decides if there has been changes
      // If zapier finds a new id (or a changed id, as the ids get changed in this code if a status
      // has been updated) zapier will include that pulse in the return result
      user.id = mondayUser.pulse.id
      user.pulse_id = mondayUser.pulse.id
      for (column of mondayUser.column_values) {
        switch (column.title) {
          case statusMatchPhrase: 
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
      saveAndReset()
      return returnUsers
    }
    else {
      counter++
      return mondayUpdatedPulses(z, bundle)
    }
  })
};

// This function clears out the values of the valiables so that no old data gets included by mistake
function saveAndReset() {
  returnUsers = []
  returnUsers = users.slice()
  users = []
  counter = 1
}

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
      {
        key: 'status_column',
        label: 'Status Column',
        required: false
      }
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