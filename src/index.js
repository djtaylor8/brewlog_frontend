document.addEventListener('DOMContentLoaded', () => {
   
    // MAPBOX INIT 
    const map = MapAdapter.newMap();

    //COMMON ELEMENTS
    const userDiv = document.getElementById('user')
    const entryContainer = document.getElementById('entry-container')
    const navContainer = document.getElementById('nav')

    const getStarted = document.getElementById('get-started');
    const loginForm = document.getElementById('login')
    
    
    //BEGIN USER FLOW WITH CLICK EVENT ON LINK
    getStarted.addEventListener('click', (e) => {
        getStarted.hidden = true;
        loginForm.hidden = false;
    })
    //

    //USER 'LOGIN' - FIND AND LOAD USER
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginForm.hidden = true;
        const name = document.getElementById('user-name').value
        UserAdapter.fetchUser(name)
        .then(user => new User(user))
        .then(user => {
            userDiv.className = `${user.name}`
            userDiv.innerHTML = `<p>Click on a marker to view details</p>`
            userDiv.dataset.id = `${user.userId}`

            //LOAD USER ENTRIES ON MAP
            user.entries.forEach(entry => {
                let brewery = new Entry(entry)
                brewery.displayGeo(map);
            });
        });
     })
});