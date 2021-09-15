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

    static setEntry() {
        const entryDetails = document.getElementById("entry-details");
        const entryId = entryDetails.dataset.id;
       let entry = Entry.all.find(entry => entry.id == entryId)
       return entry;
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

            new mapboxgl.Marker(el)
            .setLngLat(geometry.coordinates)
            .addTo(map);

            el.addEventListener('click', (e) => {
                this.renderEntries();
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

        entryDetails.dataset.id = `${this.id}`
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

        backBtn.addEventListener('click', (e) => {
            entryDetails.innerHTML = '';
            entryDetails.dataset.id = '';
            editBtn.hidden = true;
            deleteBtn.hidden = true;
            addBtn.hidden = false;
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
                    let brewery = new Entry(entry, map)
                    brewery.displayGeo(map);
                    const breweryNotes = document.getElementById('brewery-notes');
                    breweryNotes.value = '';
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

    static editEntry(map) {
        const addBtn = document.getElementById("add-new-btn");
        let entryDiv = document.getElementById("entry-details");
        const editBtn = document.getElementById("edit-form");
        const entryOptions = document.getElementById('entry-options')
        const editForm = document.getElementById("edit-entry");
        const deleteBtn = document.getElementById('delete-entry');
        const name = document.getElementById('name');
        const location = document.getElementById('location');
        const notes = document.getElementById('notes');
        const viewAllBtn = document.getElementById('view-all');

        editBtn.hidden = false;

        editBtn.addEventListener('click', (e) => {
            let entryEdit = Entry.setEntry();
            entryDiv.hidden = true;
            entryOptions.hidden = true;
            editForm.hidden = false;
            name.setAttribute('value', `${entryEdit.name}`);
            location.setAttribute('value', `${entryEdit.location}`); 
            notes.setAttribute('value', `${entryEdit.notes}`); 
        })

        editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                editForm.hidden = true;
                // editForm.innerHTML = ''
                let currentUser = document.getElementById('user').dataset.id;
                const breweryName = name.value;
                const breweryLocation = location.value;
                const breweryNotes = notes.value;
                let userId = currentUser;
                let breweryId = entryDiv.dataset.id;
                entryDiv.hidden = true;
                entryOptions.hidden = false;
                deleteBtn.hidden = true
                editBtn.hidden = true;
                let entryIndex = Entry.all.findIndex(entry => entry.id == breweryId)
                Entry.all.splice(entryIndex, 1)

                entryDiv.innerHTML = '';
                viewAllBtn.hidden = false;

                EntryAdapter.editEntry(breweryName, breweryLocation, breweryNotes, userId, breweryId)
                .then(entry => {
                    console.log(entry)
                    let brewery = new Entry(entry)
                    brewery.displayGeo(map)
                 });

            viewAllBtn.addEventListener('click', (e) => {
                viewAllBtn.hidden = true;
                entryDiv.hidden = false;
                addBtn.hidden = false;
                MapAdapter.centerMap(map)
            }) 
        })
    }

   static deleteEntry(map) {
        const addBtn = document.getElementById("add-new-btn");
        const entryDetails = document.getElementById('entry-details');
        const deleteBtn = document.getElementById('delete-entry');
        const editBtn = document.getElementById('edit-form')
        const viewAllBtn = document.getElementById('view-all');

        deleteBtn.addEventListener('click', (e) => {
            let entryDelete = Entry.setEntry();
            let entryMarker = document.getElementById(`entry-${entryDelete.id}`)
            entryMarker.remove();
            const entryId = entryDelete.id;
            entryDetails.innerHTML = '';
            editBtn.hidden = true;
            deleteBtn.hidden = true;
            viewAllBtn.hidden = false;
            let entryIndex = Entry.all.findIndex(entry => entry.id == entryId)
            Entry.all.splice(entryIndex, 1)

            EntryAdapter.deleteEntry(entryDelete)
            .then(res => {
                console.log(res)
            });
        });
        
        viewAllBtn.addEventListener('click', (e) => {
            viewAllBtn.hidden = true;
            addBtn.hidden = false;
            MapAdapter.centerMap(map) 
        })
    }
}