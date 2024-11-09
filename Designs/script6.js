let API_URL = "http://localhost:4000/";

const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;

            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            options.forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
});


//code for the maintenance page
document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.querySelector('.subbtn');

  submitButton.addEventListener('click', function() {
    // Retrieve selected room
    const selectedRoom = document.querySelector('.menu .active').textContent;

    // Retrieve checkbox and comments data for each equipment
    const fanChecked = document.getElementById('fan-checkbox').checked ? 'Yes' : 'No';
    const fanComments = document.getElementById('fan-comments').value;

    const acChecked = document.getElementById('ac-checkbox').checked ? 'Yes' : 'No';
    const acComments = document.getElementById('ac-comments').value;

    const projectorChecked = document.getElementById('projector-checkbox').checked ? 'Yes' : 'No';
    const projectorComments = document.getElementById('projector-comment').value;

    const lightChecked = document.getElementById('light-checkbox').checked ? 'Yes' : 'No';
    const lightComments = document.getElementById('light-comments').value;

    // Constructing the data object to send to the server
    const data = {
      id: selectedRoom,
      fan: fanChecked,
      fan_comments: fanComments,
      ac: acChecked,
      ac_comments: acComments,
      projector: projectorChecked,
      projector_comments: projectorComments,
      light: lightChecked,
      light_comments: lightComments
    };

    // Send data to the server
    sendDataToServer(data);
  });
});

// let sendDataToServer = async(data)=>{
//   // Assuming you're using fetch API to send data to the server
//   const response = await fetch(API_URL + 'submit', {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: { 'Content-Type': 'application/json' }
//   })
//   .then(res => res.json())
 
//   .catch  (err => {
//     console.error(err);
//   }
 
// );

// }

let sendDataToServer = async(data)=>{
    // Assuming you're using fetch API to send data to the server
    const response = await fetch(API_URL + 'submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => window.location.reload())
    .catch  (err => {
      console.error(err);
    }
   
  );
  }
let populateTable = async()=> {let data = 0;
  const id = document.querySelector('.menu .active').textContent;
   data = await fetch(API_URL + 'admindata/' + id);
   data = await data.json();


            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = ''; // Clear previous data
if(data!=0){
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.fan}</td>
                    <td>${item.fan_comments}</td>
                    <td>${item.ac}</td>
                    <td>${item.ac_comments}</td>
                    <td>${item.projector}</td>
                    <td>${item.projector_comments}</td>
                    <td>${item.light}</td>
                    <td>${item.light_comments}</td>
                    <td>${item.day}</td>
                    <td>${item.start_time}</td>
                    <td>${item.end_time}</td>
                    <td>${item.course}</td>
                `;
                tableBody.appendChild(row);
            });
        }

   
      }


