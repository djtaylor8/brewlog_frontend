document.addEventListener('DOMContentLoaded', () => {
    const endPoint = 'http://localhost:3000/api/v1/users/'
    fetch(endPoint) 
    .then(res => res.json())
    .then(json => console.log(json));
   
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGp0YXlsb3IiLCJhIjoiY2t0NmJyNTh3MGd6aTJxbzhzajV5d251OSJ9.i0hGcpcDK2kDXEyK3l2NHA'
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-118.24335241609123,34.0524555209941],
        zoom: 13
    });
         map.addControl(
            new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    );

    const getStarted = document.getElementById('get-started');
    const loginForm = document.getElementById('login')
    getStarted.addEventListener('click', (e) => {
        getStarted.hidden = true;
        loginForm.hidden = false;
    })

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const welcome = document.getElementById('welcome')
        const name = document.getElementById('name').value
        UserAdapter.fetchUser(name)
        .then(user => new User(user))
        .then(user => {
            welcome.innerHTML = `<h4>Hi there, ${user.name}</h4>`
            user.entries.forEach(entry => {
                let brewery = new Entry(entry)
                welcome.innerHTML += `<ul>${brewery.name}</ul>` 
            })
        })
        loginForm.hidden = true;
    })
});
