class EntryAdapter {
    
    static baseURL = "http://localhost:3000/api/v1/users"

    static createEntry(name, location, notes, userId) {
        const entry = {
            name: name,
            location: location,
            notes: notes,
            user_id: userId 
        };
        return fetch(EntryAdapter.baseURL + `/${userId}/entries`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify( {entry} )
        }).then(res => res.json())
    }

    static editEntry(name, location, notes, user_id, entry_id) {
        const entry = {
            name: name,
            location: location,
            notes: notes,
            user_id: user_id
        }
        return fetch(EntryAdapter.baseURL + `/${user_id}/entries/${entry_id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify( {entry} )
        }).then(res => res.json())
    }

    static deleteEntry(entry) {
        
        return fetch(EntryAdapter.baseURL + `/${entry.userId}/entries/${entry.id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json())
    }
}