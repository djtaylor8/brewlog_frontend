class App {

    constructor(map) {
        Entry.all = [];
        User.setUser(map)
        Entry.addEntry(map)
    }

}