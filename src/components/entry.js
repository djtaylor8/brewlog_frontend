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
            el.dataset.target = '#entryModal'
            el.dataset.toggle = 'modal'

            new mapboxgl.Marker(el)
            .setLngLat(geometry.coordinates)
            .addTo(map);

            el.addEventListener('click', (e) => {
                this.renderEntries();
                // this.clearEntry(map);
            })
        }
    };

    renderEntries() {
        const modal = document.getElementById('entry-modal')
        modal.innerHTML = 
        `
        <div class="modal fade" id="entryModal" tabindex="-1" role="dialog" aria-labelledby="enrtyModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="entryModalLabel">${this.name}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ${this.notes}
            </div>
            <div class="modal-footer">
              <button type="button" id="editButton" class="btn btn-secondary" data-dismiss="modal">Edit</button>
              <button type="button" id="deleteButton" class="btn btn-primary" data-dismiss="modal">Delete</button>
            </div>
          </div>
        </div>
      </div>      
        `
        const editButton = document.getElementById('editButton')
        editButton.addEventListener('click', (e) => {
            const addBtn = document.getElementById("add-new-btn");
            addBtn.hidden = true;
            this.renderEditForm();
        })

        const deleteButton = document.getElementById('deleteButton')
        deleteButton.addEventListener('click', (e) => {
            let entryMarker = document.getElementById(`entry-${this.id}`)
            entryMarker.remove();
            App.deleteEntry(this);
        })
    }

    renderEditForm() {
        const editForm = document.getElementById("edit-entry");
        const name = document.getElementById('name');
        const location = document.getElementById('location');
        const notes = document.getElementById('notes');
        const entryId = document.getElementById('entry-id');
        editForm.hidden = false;

        name.setAttribute('value', `${this.name}`)
        location.setAttribute('value', `${this.location}`)
        notes.value = `${this.notes}`
        entryId.setAttribute('value', `${this.id}`)
    }
}