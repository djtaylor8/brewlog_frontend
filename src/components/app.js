class App {

    constructor(map) {
        Entry.all = [];
        User.setUser(map)
        App.addEntry(map)
        App.editEntry(map)
        App.deleteEntry(map)
    }

    static viewAll(map) {
        let entryDiv = document.getElementById("entry-details");
        const viewAllBtn = document.getElementById('view-all');
        const addBtn = document.getElementById("add-new-btn");
        viewAllBtn.hidden = false;
        viewAllBtn.addEventListener('click', (e) => {
            viewAllBtn.hidden = true;
            entryDiv.hidden = false;
            addBtn.hidden = false;
            MapAdapter.centerMap(map)
        }) 
    }

    static setEntry() {
        const entryDetails = document.getElementById("entry-details");
        const entryId = entryDetails.dataset.id;
       let entry = Entry.all.find(entry => entry.id == entryId)
       return entry;
    }

    static addEntry(map) {
        const addBtn = document.getElementById("add-new-btn");
        const entryDiv = document.getElementById('entry');
        const entryOptions = document.getElementById('entry-options')
        const editBtn = document.getElementById('edit-form')
        const deleteBtn = document.getElementById('delete-entry')
        const addForm = document.getElementById("new-entry");
        const currentUser = document.getElementById('user');

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
                    addBtn.hidden = true;
                    deleteBtn.hidden = true;
                });
                App.viewAll(map)
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
        const entryId = document.getElementById('entry-id');
        editBtn.hidden = true;

        editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                editForm.hidden = true;
                let currentUser = document.getElementById('user').dataset.id;
                const breweryName = name.value;
                const breweryLocation = location.value;
                const breweryNotes = notes.value;
                const breweryId = entryId.value;
                entryDiv.hidden = true;
                entryOptions.hidden = false;
                deleteBtn.hidden = true
                editBtn.hidden = true;
                let entryIndex = Entry.all.findIndex(entry => entry.id == breweryId)
                Entry.all.splice(entryIndex, 1)
                entryDiv.innerHTML = '';

                EntryAdapter.editEntry(breweryName, breweryLocation, breweryNotes, currentUser, breweryId)
                .then(entry => {
                    console.log(entry)
                    let brewery = new Entry(entry)
                    brewery.displayGeo(map)
                 })
                 .then(App.viewAll(map));
        })
    }

   static deleteEntry(map) {
        const addBtn = document.getElementById("add-new-btn");
        const entryDetails = document.getElementById('entry-details');
        const deleteBtn = document.getElementById('delete-entry');
        const editBtn = document.getElementById('edit-form')

        deleteBtn.addEventListener('click', (e) => {
            let entryDelete = App.setEntry();
            let entryMarker = document.getElementById(`entry-${entryDelete.id}`)
            entryMarker.remove();
            const entryId = entryDelete.id;
            entryDetails.innerHTML = '';
            editBtn.hidden = true;
            deleteBtn.hidden = true;
            let entryIndex = Entry.all.findIndex(entry => entry.id == entryId)
            Entry.all.splice(entryIndex, 1)

            EntryAdapter.deleteEntry(entryDelete)
            .then(res => {
                console.log(res)
            })
            .then(App.viewAll(map))
        });
    }

}