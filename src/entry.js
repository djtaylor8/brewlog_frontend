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
            })
        }
    };

    renderEntries() {
        const editBtn = document.getElementById('edit-form')
        const deleteBtn = document.getElementById('delete-entry')
        editBtn.hidden = false;
        deleteBtn.hidden = false;

        const entryDetails = document.getElementById('entry-details')
        entryDetails.dataset.id = `${this.id}`

        const entryName = document.createElement('p')
        const details = document.createElement('p')
        
        entryName.innerHTML = `${this.name}`
        details.innerHTML = `Notes: ${this.notes}`
        
        entryDetails.append(entryName, details)
    }

    clearEntry() {
        const entryDetails = document.getElementById('entry-details')
        const closeMarker = document.getElementById(`entry-${this.id}`)
        const editBtn = document.getElementById('edit-form')
        const deleteBtn = document.getElementById('delete-entry')

        closeMarker.addEventListener('click', (e) => {
            entryDetails.innerHTML = '';
            entryDetails.dataset.id = '';
            editBtn.hidden = true;
            deleteBtn.hidden = true;
        })
    }

    editEntry() {
        const entryDiv = document.getElementById("entry-details");
        const editBtn = document.getElementById("edit-form");
        const editForm = document.getElementById("edit-entry");
        const name = document.getElementById('name');
        const location = document.getElementById('location');
        const notes = document.getElementById('notes');
        const userId = document.getElementById('user_id');

        editBtn.hidden = false;

        editBtn.addEventListener('click', (e) => {
            entryDiv.hidden = true;
            editForm.hidden = false;
            name.setAttribute('value', `${this.name}`);
            location.setAttribute('value', `${this.location}`); 
            notes.setAttribute('value', `${this.notes}`); 
            userId.setAttribute('value', `${this.userId}`); 
        })
            //add values to edit form
        editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                editForm.hidden = true;
                const breweryName = name.value;
                const breweryLocation = location.value;
                const breweryNotes = notes.value;
                const breweryUserId = userId.value;
                const breweryId = entryDiv.dataset.id;

                EntryAdapter.editEntry(breweryName, breweryLocation, breweryNotes, breweryUserId, breweryId)
                .then(entry => new Entry(entry))
                .then(entry => {
                let brewery = entry; 
                entryDiv.innerHTML = `<h4>${brewery.name}</h4>`
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
                              brewery.renderEntries();
                              brewery.clearEntry();
                              brewery.editEntry();
                        })

                        new mapboxgl.Marker(el)
                        .setLngLat(geometry.coordinates)
                        .setPopup(popup)
                        .addTo(map);
                    }
                    displayGeo();
                };
            });
        })
    }

    deleteEntry() {
        const entryContainer = document.getElementById('entry-container')
        //DELETE BUTTON NEEDED
        deleteBtn.addEventListener('click', (e) => {
            const entryId = e.target.previousSibling.dataset.id
            const entryIndex = Entry.all.findIndex(entry => entry.id == entryId)

            EntryAdapter.deleteEntry(entry)
            .then(res => {
                if (res.status == 'error') {
                    console.log(res.status)
                } else {
                    Entry.all.splice(entryIndex, 1)
                    console.log('Success!')
                }
            })
        })
    }
}