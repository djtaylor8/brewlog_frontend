document.addEventListener('DOMContentLoaded', () => {
    const endPoint = 'http://localhost:3000/api/v1/users/'
    fetch(endPoint) 
    .then(res => res.json())
    .then(json => 
        json.forEach(user => { 
            console.log(user.name)           
            user.entries.forEach(entry => {
            const markup = `
            <li>
              <p>${entry.name}</p>
              <p>${entry.location}</p>
              <p>${entry.beers}</p>
              <p>${entry.notes}</p>
            </li>
            <button>Edit</button>`

            document.querySelector('#entries-list').innerHTML += markup;
            })
        })
    );
});