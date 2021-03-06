
const editClient = (e) => {
  e.preventDefault();
  let targetId = e.target.closest('.clientCard').dataset.clientId;
  let url = '/api/clients/' + targetId + '/edit';
  console.log('Request to edit ' + targetId + ' via ' + url);
  $.ajax({
    method: 'PATCH',
    url: url,
    success: () => {
      console.log('Edited ' + targetId);
    },
    error: () => {
      console.log('Edit client error!');
    }
  });
}

const removeClient = (id) => {
  let url = '/api/clients/' + id;
  $.ajax({
    method: 'DELETE',
    url: url,
    success: () => {
      console.log('Removed ' + id);
    },
    error: () => {
      console.log('Remove client error!');
    }
  }); 
  renderClientCards();
}

// Format phone number by adding parentheses and a dash
const formatPhoneNumber = (phoneNumber) => {
  let digits = phoneNumber.toString().split('');
  return '(' + digits.slice(0, 3).join('') + ')' + digits.slice(3, 6).join('') + '-' + digits.slice(-4).join('');
}

// Format address by presenting it in 2 lines format
const formatAddress = (address) => {
  let addressLines = address.split(',');
  return addressLines[0] + '<br>' + addressLines[1] + ', ' + addressLines[2];
}
