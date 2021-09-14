document.addEventListener('DOMContentLoaded', () => {
   
    // MAPBOX INIT 
    const map = MapAdapter.newMap();

    //COMMON ELEMENTS
    const userDiv = document.getElementById('user')
    const entryContainer = document.getElementById('entry-container')
    const navContainer = document.getElementById('nav')
    const addBtn = document.getElementById('add-new-form');

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
        new App(map);
    })
});
