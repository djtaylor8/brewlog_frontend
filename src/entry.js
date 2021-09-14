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
                this.editEntry(map);
                this.deleteEntry(this, map);
                this.clearEntry(map);
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

    clearEntry(map) {
        const addBtn = document.getElementById('add-new-btn')
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
            addBtn.hidden = false;
            user.showAllEntriesAfterLoad(map);
            MapAdapter.centerMap(map);
        })
    }

    static addEntry(map) {
        const addBtn = document.getElementById("add-new-btn");
        const entryDiv = document.getElementById('entry');
        const entryOptions = document.getElementById('entry-options')
        const editBtn = document.getElementById('edit-form')
        const deleteBtn = document.getElementById('delete-entry')
        const addForm = document.getElementById("new-entry");
        const currentUser = document.getElementById('user');
        const viewAllBtn = document.getElementById('view-all');

        addBtn.addEventListener('click', (e) => {
        entryOptions.hidden = true;
        addForm.hidden = false;
        })

        addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addForm.hidden = true;
                let searchInput = document.querySelector('.mapboxgl-ctrl-geocoder--input');
                let formInputs = searchInput.value.split(', ');
                const breweryName = formInputs[0];
                const breweryLocation = formInputs.slice(1).join(', ');
                const breweryNotes = document.getElementById('brewery-notes').value;
                const userId = currentUser.dataset.id;

                EntryAdapter.createEntry(breweryName, breweryLocation, breweryNotes, userId)
                .then(entry => {
                    console.log(entry)
                    let brewery = new Entry(entry)
                    brewery.displayGeo(map);
                    entryOptions.hidden = false;
                    viewAllBtn.hidden = false;
                    addBtn.hidden = true;
                    deleteBtn.hidden = true;
                });
        })

        viewAllBtn.addEventListener('click', (e) => {
            viewAllBtn.hidden = true;
            addBtn.hidden = false;
            MapAdapter.centerMap(map)
        })

    }

    editEntry(map) {
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
                editForm.innerHTML = ''
                const breweryName = name.value;
                const breweryLocation = location.value;
                const breweryNotes = notes.value;
                const userId = currentUser.dataset.id;
                const breweryId = entryDiv.dataset.id;
                entryDiv.hidden = false;
                entryOptions.hidden = false;
                entryDiv.innerHTML = '';

                EntryAdapter.editEntry(breweryName, breweryLocation, breweryNotes, userId, breweryId)
                .then(entry => {
                    console.log(entry);
                    const entryIndex = User.all[0].entries.findIndex(entry => entry.id == breweryId)
                    User.all[0].entries.splice(entryIndex, 1, entry)
                 });
        })
    }

    deleteEntry(entry, map) {
        const entryDetails = document.getElementById('entry-details');
        const deleteBtn = document.getElementById('delete-entry');
        const editBtn = document.getElementById('edit-form')
        const entryMarker = document.getElementById(`entry-${this.id}`)

        deleteBtn.addEventListener('click', (e) => {
            const entryId = entryDetails.dataset.id;
            const entryIndex = User.all[0].entries.findIndex(entry => entry.id == entryId)
            entryDetails.innerHTML = '';
            entryMarker.remove();
            editBtn.hidden = true;
            deleteBtn.hidden = true;
            EntryAdapter.deleteEntry(entry)
            .then(entries => {
                console.log(entries)
                User.all[0].entries.splice(entryIndex, 1)
                Entry.all = [];
                entries.forEach(entry => {
                    let brewery = new Entry(entry)
                    brewery.displayGeo(map);
                })
            })
        })
    }
}