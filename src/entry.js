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
            console.log('hi')
            entryDetails.innerHTML = '';
            editBtn.hidden = true;
            deleteBtn.hidden = true;
        })
    }

    static newEntryForm() {
        const addForm = document.getElementById('new-entry');
        const currentUser = document.getElementById('user')
        addForm.hidden = false;

        const input = document.querySelector('.mapboxgl-ctrl-geocoder--input')
        
        const hiddenInput = document.createElement('input');
        const hiddenId = document.createElement('input');
        hiddenId.id = 'user-id'
        hiddenId.type = 'hidden'
        hiddenId.name = 'user-id'
        hiddenId.value = `${currentUser.dataset.id}`
        hiddenInput.type = 'hidden'
        hiddenInput.id = 'details'
        hiddenInput.name = 'details'
        hiddenInput.value = `${input.value}`
        
        addForm.appendChild(hiddenInput, hiddenId);
    }

    editEntry() {
        const entryDiv = document.getElementById("entry-details");
        const editBtn = document.getElementById("edit-form");
        const editForm = document.getElementById("edit-entry");
        editBtn.hidden = false;

        editBtn.addEventListener('click', (e) => {
            editForm.hidden = false;
        })
            //add values to edit form
        editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const breweryName = document.getElementById('name').value;
                const breweryLocation = document.getElementById('location').value;
                const breweryNotes = document.getElementById('notes').value;
                const breweryUserId = document.getElementById('user_id').value;
                const breweryId = entryDiv.dataset.id;

                const entryContainer = document.getElementById('entry-container')


                EntryAdapter.editEntry(breweryName, breweryLocation, breweryNotes, breweryUserId, breweryId)
                .then(entry => new Entry(entry))
                .then(entry => {
                let brewery = entry; 
                entryContainer.innerHTML = `<h4>${brewery.name}</h4>`

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
                            entryDiv.innerHTML = `${brewery.name}`
                            const details = document.createElement('p')
                            // details.innerHTML = `${brewery.notes}`
                            // entryDiv.appendChild(details)
                            entryContainer.appendChild(entryDiv);
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