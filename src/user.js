class User {
    
    static all = []

    constructor(user) {
        this.userId = user.id;
        this.name = user.name;
        this.entries = user.entries;

        User.all.push(this)
    }

    static setUser (map) {
        const userDiv = document.getElementById('user')
        const name = document.getElementById('user-name').value
        UserAdapter.fetchUser(name)
        .then((user) => {
            if (User.all.length === 0) {
                user = new User(user)
            } else {
                user = User.all.find(user => user.name == user.name)
            }
            return user;
        })
        .then(user => {
            userDiv.className = `${user.name}`
            userDiv.innerHTML = `<p>Click on a marker to view details</p>`
            userDiv.dataset.id = `${user.userId}`

            user.showAllEntries(map);
            const addBtn = document.getElementById("add-new-btn");
            addBtn.hidden = false;
        });
    }
    
    showAllEntries(map) {
        this.entries.forEach(entry => {
            let brewery = new Entry(entry)
            brewery.displayGeo(map);
        })
    }


}