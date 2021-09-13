class Entry {

    static all = [];

    constructor({id, name, location, notes, user_id}) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.notes = notes;
        this.userId = user_id;


        Entry.all.push(this)
    }

    geocodingLocation() {
        let search = encodeURIComponent(this.location)
        return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?limit=1&access_token=pk.eyJ1IjoiZGp0YXlsb3IiLCJhIjoiY2t0NmJyNTh3MGd6aTJxbzhzajV5d251OSJ9.i0hGcpcDK2kDXEyK3l2NHA`)
            .then(res => res.json())
            .then(data => {
                return data.features
            })
    }

    async displayGeo(map) {
        const geocode = this.geocodingLocation(); 
        const assignLoc = await geocode;
        for (const { geometry, properties } of assignLoc) {
            const el = document.createElement('div');
            el.className = 'marker';
            el.id = `entry-${this.id}`
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div>${this.name}</div>`
            );
            new mapboxgl.Marker(el)
            .setLngLat(geometry.coordinates)
            .setPopup(popup)
            .addTo(map);

            el.addEventListener('click', (e) => {
                this.renderEntries();
                this.editEntry();
                this.deleteEntry(this);
                this.clearEntry();
            })
        }
    };

    renderEntries() {
        const editBtn = document.getElementById('edit-form')
        const deleteBtn = document.getElementById('delete-entry')
        const backBtn = document.createElement('button');
        const entry = document.getElementById('entry')
        const entryDetails = document.getElementById('entry-details')
        const entryOptions = document.getElementById('entry-options')
        const addBtn = document.getElementById('add-new-btn')
        editBtn.hidden = false;
        deleteBtn.hidden = false;
        addBtn.hidden = true;

        backBtn.type = 'button'
        backBtn.id = 'back'
        backBtn.className = 'btn btn-secondary'
        backBtn.innerHTML = 'Back'

        entryDetails.dataset.id = `${this.id}`

        const entryName = document.createElement('p')
        const details = document.createElement('p')
        
        entryName.innerHTML = `${this.name}`
        details.innerHTML = `Notes: ${this.notes}`
        
        entryDetails.append(entryName, details, backBtn)
    }

    clearEntry() {
        const entryDiv = document.getElementById('entry')
        const entryDetails = document.getElementById('entry-details')
        const backBtn = document.getElementById('back');
        const editBtn = document.getElementById('edit-form')
        const deleteBtn = document.getElementById('delete-entry')
        const userDiv = document.getElementById('user')
        let user = User.all.find(user => user.userId == userDiv.dataset.id)

        backBtn.addEventListener('click', (e) => {
            entryDetails.innerHTML = '';
            entryDetails.dataset.id = '';
            editBtn.hidden = true;
            deleteBtn.hidden = true;
            const map = MapAdapter.newMap();
            new App(map);
        })
    }

    static addEntry() {
        const addBtn = document.getElementById("add-new-btn");
        const entryDiv = document.getElementById('entry');
        const entryOptions = document.getElementById('entry-options')
        const addForm = document.getElementById("new-entry");
        const currentUser = document.getElementById('user');
        const viewAllBtn = document.createElement('button');
        viewAllBtn.type = 'button'
        viewAllBtn.className = 'btn btn-secondary'
        viewAllBtn.id = 'view-all'
        viewAllBtn.innerHTML = 'View All Entries'

        addBtn.addEventListener('click', (e) => {
            entryOptions.hidden = true;
            addForm.hidden = false;
        })
        addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addForm.hidden = true;
                const searchInput = document.querySelector('.mapboxgl-ctrl-geocoder--input').value;
                const formInputs = searchInput.split(', ');

                const breweryName = formInputs[0];
                const breweryLocation = formInputs.slice(1).join(', ');
                const breweryNotes = document.getElementById('brewery-notes').value;
                const userId = currentUser.dataset.id;

                EntryAdapter.createEntry(breweryName, breweryLocation, breweryNotes, userId)
                .then(entry => {
                    User.all[0].entries.push(entry);
                });
                entryDiv.appendChild(viewAllBtn);
        })

        viewAllBtn.addEventListener('click', (e) => {
            const map = MapAdapter.newMap();
            new App(map);
        })

    }

    editEntry() {
        const entryDiv = document.getElementById("entry-details");
        const editBtn = document.getElementById("edit-form");
        const entryOptions = document.getElementById('entry-options')
        const editForm = document.getElementById("edit-entry");
        const name = document.getElementById('name');
        const location = document.getElementById('location');
        const notes = document.getElementById('notes');
        const currentUser = document.getElementById('user')


        editBtn.hidden = false;

        editBtn.addEventListener('click', (e) => {
            entryDiv.hidden = true;
            entryOptions.hidden = true;
            editForm.hidden = false;
            name.setAttribute('value', `${this.name}`);
            location.setAttribute('value', `${this.location}`); 
            notes.setAttribute('value', `${this.notes}`); 
        })
        editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                editForm.hidden = true;
                const breweryName = name.value;
                const breweryLocation = location.value;
                const breweryNotes = notes.value;
                const userId = currentUser.dataset.id;
                const breweryId = entryDiv.dataset.id;

                EntryAdapter.editEntry(breweryName, breweryLocation, breweryNotes, userId, breweryId)
                .then(entry => {
                    console.log(entry);
                 });
             const map = MapAdapter.newMap();
             new App(map); 
        })
    }

    deleteEntry(entry) {
        const entryDetails = document.getElementById('entry-details');
        const deleteBtn = document.getElementById('delete-entry');
        const editBtn = document.getElementById('edit-form')

        deleteBtn.addEventListener('click', (e) => {
            const entryId = entryDetails.dataset.id;
            const entryIndex = User.all[0].entries.findIndex(entry => entry.id == entryId)
            entryDetails.innerHTML = '';
            editBtn.hidden = true;
            deleteBtn.hidden = true;
            EntryAdapter.deleteEntry(entry)
            .then(res => {
                if (res.status == 'error') {
                    console.log(res.status)
                } else {
                    User.all[0].entries.splice(entryIndex, 1)
                    console.log('Success!')
                }
                const map = MapAdapter.newMap();
                new App(map);
            })
        })
    }
}