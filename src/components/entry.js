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
                this.clearEntry(map);
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
              <button type="button" id="deleteButton" class="btn btn-primary">Delete</button>
            </div>
          </div>
        </div>
      </div>      
        `

        // const editBtn = document.getElementById('edit-form')
        // const deleteBtn = document.getElementById('delete-entry')
        // const backBtn = document.createElement('button');
        // const entry = document.getElementById('entry')
        // const entryDetails = document.getElementById('entry-details')
        // const entryOptions = document.getElementById('entry-options')
        // const addBtn = document.getElementById('add-new-btn')
        // editBtn.hidden = false;
        // deleteBtn.hidden = false;
        // addBtn.hidden = true;

        // backBtn.type = 'button'
        // backBtn.id = 'back'
        // backBtn.className = 'btn btn-secondary'
        // backBtn.innerHTML = 'Back'

        // entryDetails.dataset.id = `${this.id}`

        // const entryName = document.createElement('p')
        // const details = document.createElement('p')
        
        // entryName.innerHTML = `${this.name}`
        // details.innerHTML = `Notes: ${this.notes}`

        // entryDetails.dataset.id = `${this.id}`
        // entryDetails.append(entryName, details, backBtn)
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
}