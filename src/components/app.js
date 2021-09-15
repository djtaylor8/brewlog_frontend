class App {

    constructor(map) {
        Entry.all = [];
        User.setUser(map)
        Entry.addEntry(map)
        Entry.editEntry(map)
        Entry.deleteEntry(map)
    }

}