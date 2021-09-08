document.addEventListener('DOMContentLoaded', () => {
   
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGp0YXlsb3IiLCJhIjoiY2t0NmJyNTh3MGd6aTJxbzhzajV5d251OSJ9.i0hGcpcDK2kDXEyK3l2NHA'
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-118.24335241609123,34.0524555209941],
        zoom: 9
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
        const entryContainer = document.getElementById('entry-container')
        const name = document.getElementById('name').value
        UserAdapter.fetchUser(name)
        .then(user => new User(user))
        .then(user => {
            welcome.innerHTML = `<h4>Hi there, ${user.name}</h4>`

            user.entries.forEach(entry => {
                let brewery = new Entry(entry)
                const geocode = brewery.geocodingLocation(); 
                const displayGeo = async () => {
                    const assignLoc = await geocode;
                    for (const { geometry, properties } of assignLoc) {
                        const el = document.createElement('div');
                        el.className = 'marker';
                        el.id = `entry-${brewery.id}`
                        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                            `<a href="#" id="entry-${brewery.id}-link">${brewery.name}</a>`
                        );
                            el.addEventListener('click', (e) => {
                            const entryDiv = document.createElement('div')
                            const btnBack = document.createElement('button')
                            btnBack.type = 'button'
                            btnBack.className = 'btn btn-secondary'
                            btnBack.innerHTML = 'Back'
                            btnBack.onclick = function () {return this.parentNode.remove()}
                            entryDiv.innerHTML = `${brewery.name}`
                            const details = document.createElement('p')
                            // details.innerHTML = `${brewery.notes}`
                            
                            // entryDiv.appendChild(details)
                            entryDiv.appendChild(btnBack);
                            entryContainer.appendChild(entryDiv);
                        })

                        new mapboxgl.Marker(el)
                        .setLngLat(geometry.coordinates)
                        .setPopup(popup)
                        .addTo(map);
                    }
                };
                displayGeo();
            });
            const newBtn = document.createElement('button')
            newBtn.type = 'button'
            newBtn.className = 'btn btn-secondary'
            newBtn.innerHTML = 'Add new brewery'
            entryContainer.appendChild(newBtn);
    
            newBtn.addEventListener('click', (e) => {
                const addForm = document.getElementById('new-entry');
                addForm.hidden = false;
                newBtn.hidden = true;
    
                const input = document.querySelector('.mapboxgl-ctrl-geocoder--input')
    
                const hiddenInput = document.createElement('input');
                const hiddenId = document.createElement('input');
                hiddenId.id = 'user-id'
                hiddenId.type = 'hidden'
                hiddenId.name = 'user-id'
                hiddenId.value = `${user.userd}`
                hiddenInput.type = 'hidden'
                hiddenInput.id = 'details'
                hiddenInput.name = 'details'
                hiddenInput.value = `${input.value}`
                addForm.appendChild(hiddenInput);
                addForm.appendChild(hiddenId);
    
            })

        });
        loginForm.hidden = true;

    })
});
