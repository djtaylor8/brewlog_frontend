class UserAdapter {
    static baseURL = "http://localhost:3000/api/v1/users"

    static fetchUser(nameInput) {
      const user = {
          name: nameInput
      }

      return fetch(UserAdapter.baseURL, {
          method: "POST",
          headers: {
              'content-type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify( {user} )
      }).then(res => res.json())
    }
}