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
}