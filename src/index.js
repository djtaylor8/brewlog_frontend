document.addEventListener('DOMContentLoaded', () => {
   
    // MAPBOX INIT 
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

    //COMMON ELEMENTS
    const welcome = document.getElementById('welcome')
    const entryContainer = document.getElementById('entry-container')
    const navContainer = document.getElementById('nav')

    const getStarted = document.getElementById('get-started');
    const loginForm = document.getElementById('login')
    
    
    //BEGIN USER FLOW WITH CLICK EVENT ON LINK
    getStarted.addEventListener('click', (e) => {
        getStarted.hidden = true;
        loginForm.hidden = false;
    })
    //

    //USER 'LOGIN' - FIND AND LOAD USER
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name').value
        UserAdapter.fetchUser(name)
        .then(user => new User(user))
        .then(user => {
            welcome.innerHTML = `<h4>Click on a marker to view details</h4>`
            welcome.dataset.id = `${user.userId}`

            //LOAD USER ENTRIES ON MAP
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
                            `<div>${brewery.name}</div>`
                        );
                        //DISPLAY BREWERY DETAILS ON MARKER CLICK
                            el.addEventListener('click', (e) => {
                            brewery.renderEntries();
                            brewery.editEntry();
                            brewery.deleteBrewery();
                        })
                        new mapboxgl.Marker(el)
                        .setLngLat(geometry.coordinates)
                        .setPopup(popup)
                        .addTo(map);
                    }
                };
                displayGeo();
            });

            //ADD BUTTON TO CREATE NEW BREW ENTRY

            const newBtn = document.createElement('button')
            newBtn.type = 'button'
            newBtn.id = 'add-new-form'
            newBtn.className = 'btn btn-secondary'
            newBtn.innerHTML = 'Add new brewery'
            navContainer.appendChild(newBtn);
    
            //CREATE NEW BREW ENTRY EVENT LISTENER
            newBtn.addEventListener('click', (e) => {
                Entry.newEntryForm();
            })

        });
        loginForm.hidden = true;

        //ACTION FOR ADDING NEW ENTRY ON SUBMIT (SAME AS ABOVE...)

        const addForm = document.getElementById('new-entry');

        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const breweryInput = document.getElementById('details').value.split(',');
            const breweryName = breweryInput[0];
            const breweryLocation = breweryInput.slice(1).join(', ');
            const breweryNotes = document.getElementById('brewery-notes').value;
            const newEntryUserId = document.getElementById('user-id').value;
            
            EntryAdapter.createEntry(breweryName, breweryLocation, breweryNotes, newEntryUserId)
            .then(entry => new Entry(entry))
            .then(entry => {
                let brewery = entry; 
                entryContainer.innerHTML = `<h4>${brewery.name}</h4>`
                //HOW TO GET USER ENTRIES HERE...
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

                        //DISPLY BREWERY DETAILS ON MARKER CLICK
                            el.addEventListener('click', (e) => {
                            brewery.renderEntries();
                            brewery.editEntry();
                            brewery.deleteEntry();
                        })

                        new mapboxgl.Marker(el)
                        .setLngLat(geometry.coordinates)
                        .setPopup(popup)
                        .addTo(map);
                    }
                    displayGeo();
                };
            });
            addForm.hidden = true;
        })
    })
});