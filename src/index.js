document.addEventListener('DOMContentLoaded', () => {
   
    // MAPBOX INIT 
    const map = MapAdapter.newMap();

    const getStarted = document.getElementById('get-started');
    const loginForm = document.getElementById('login')

    //About modal/refresh on logo
    new Navigation();
    
    //BEGIN USER FLOW WITH CLICK EVENT ON LINK
    getStarted.addEventListener('click', (e) => {
        getStarted.hidden = true;
        loginForm.hidden = false;
    })

    //USER 'LOGIN' - FIND AND LOAD USER
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginForm.hidden = true;
        new App(map);
    })
});