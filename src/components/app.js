class App {

    constructor(map) {
        Entry.all = [];
        User.setUser(map)
        App.addEntry(map)
        App.editEntry(map)
    }

    static viewAll(map) {
        const viewAllBtn = document.getElementById('view-all');
        const addBtn = document.getElementById("add-new-btn");
        viewAllBtn.hidden = false;
        viewAllBtn.addEventListener('click', (e) => {
            viewAllBtn.hidden = true;
            addBtn.hidden = false;
            MapAdapter.centerMap(map)
        }) 
    }

    static addEntry(map) {
        const addBtn = document.getElementById("add-new-btn");
        const entryOptions = document.getElementById('entry-options')
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
                });
                App.viewAll(map)
        })
    }

    static editEntry(map) {
        const addBtn = document.getElementById("add-new-btn");
        const entryOptions = document.getElementById('entry-options')
        const editForm = document.getElementById("edit-entry");
        const name = document.getElementById('name');
        const location = document.getElementById('location');
        const notes = document.getElementById('notes');
        const entryId = document.getElementById('entry-id');

        editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                editForm.hidden = true;
                let currentUser = document.getElementById('user').dataset.id;
                const breweryName = name.value;
                const breweryLocation = location.value;
                const breweryNotes = notes.value;
                const breweryId = entryId.value;
                entryOptions.hidden = false;
                let entryIndex = Entry.all.findIndex(entry => entry.id == breweryId)
                Entry.all.splice(entryIndex, 1)
                addBtn.hidden = false;

                EntryAdapter.editEntry(breweryName, breweryLocation, breweryNotes, currentUser, breweryId)
                .then(entry => {
                    console.log(entry)
                    let brewery = new Entry(entry)
                    brewery.displayGeo(map)
                 })
                 App.viewAll(map)
        })
    }

   static deleteEntry(entry) {
            let entryIndex = Entry.all.findIndex(entries => entries.id == entry.id)
            Entry.all.splice(entryIndex, 1)

            EntryAdapter.deleteEntry(entry)
            .then(res => {
                console.log(res)
            })
    }
}