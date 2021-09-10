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
        const entryContainer = document.getElementById('entry-container')

        const entryDiv = document.createElement('div');        
        entryDiv.id = "entry-details"
        entryDiv.dataset.id = `${this.id}`

        const btnBack = document.createElement('button')
        btnBack.type = 'button'
        btnBack.className = 'btn btn-secondary'
        btnBack.innerHTML = 'Back'
        btnBack.onclick = function () {return this.parentNode.remove()}
        entryDiv.innerHTML = `${this.name}`
        const details = document.createElement('p')
        details.innerHTML = `Notes: ${this.notes}`
        
        entryDiv.append(details, btnBack)
        entryContainer.appendChild(entryDiv);
    }

    static newEntryForm() {
        const addForm = document.getElementById('new-entry');
        const newBtn = document.getElementById('add-new-form');
        const welcome = document.getElementById('welcome')
        addForm.hidden = false;
        newBtn.hidden = true;

        const input = document.querySelector('.mapboxgl-ctrl-geocoder--input')
        
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-secondary'
        backBtn.innerHTML = 'Back'
        backBtn.onclick = function() {return this.parentNode.remove()}
        

        const hiddenInput = document.createElement('input');
        const hiddenId = document.createElement('input');
        hiddenId.id = 'user-id'
        hiddenId.type = 'hidden'
        hiddenId.name = 'user-id'
        hiddenId.value = `${welcome.dataset.id}`
        hiddenInput.type = 'hidden'
        hiddenInput.id = 'details'
        hiddenInput.name = 'details'
        hiddenInput.value = `${input.value}`
        
        addForm.appendChild(backBtn);
        addForm.appendChild(hiddenInput);
        addForm.appendChild(hiddenId);
    }

    editEntry() {
        const entryDiv = document.getElementById("entry-details");
        const editBtn = document.createElement('button')
        editBtn.type = 'button'
        editBtn.className = 'btn btn-secondary'
        editBtn.innerHTML = 'Edit'

        entryDiv.appendChild(editBtn);

        editBtn.addEventListener('click', (e) => {
            const editForm = document.createElement('form');
            editForm.innerHTML = `
            <label>Brewery Name:</label>
            <input type="text" id="name" name="name" value="${this.name}">
            <label>Location:</label>
            <input type="text" id="location" name="location" value="${this.location}">
            <label>Notes:</label>
            <input type="text" id="notes" name="notes" value="${this.notes}">
            <input type="hidden" id="user_id" name="user-id" value="${this.userId}">
            <input id="edit-entry" type="submit" value="submit">`

            entryDiv.appendChild(editForm);

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
                    displayGeo();
                };
            });
        })
      })
    }

    deleteEntry() {
        const entryContainer = document.getElementById('entry-container')
        const deleteBtn = document.createElement('button')
        deleteBtn.id = 'delete-entry'
        deleteBtn.innerHTML = 'Delete'
        deleteBtn.className = 'btn btn-secondary'

        entryContainer.appendChild(deleteBtn);

        deleteBtn.addEventListener('click', (e) => {
            const entryId = e.target.previousSibling.dataset.id
            const entry = Entry.all.find(entry => entry.id == entryId)

            EntryAdapter.deleteEntry(entry)
            .then(res => {
                if (res.status == 'error') {
                    console.log(res.status)
                } else {
                    Entry.all.splice(entry.id, 1)
                    console.log('Success!')
                }
            })
           
        })

    }
}