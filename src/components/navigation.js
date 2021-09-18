class Navigation {
  
    constructor() {
        this.initBindingsAndListeners()
        this.renderAboutModal()
    }

    initBindingsAndListeners() {
        const refreshButton = document.getElementById('refresh')
        const aboutButton = document.getElementById('about')
        refreshButton.addEventListener('click', this.reloadPage)
        aboutButton.addEventListener('click', this.renderAboutModal)
    }

    renderAboutModal = (e) => {
        const modal = document.getElementById('entry-modal')
        modal.innerHTML = 
        `
        <div class="modal fade" id="aboutModal" tabindex="-1" role="dialog" aria-labelledby="enrtyModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="aboutModalLabel">Welcome to Brew Log!</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Sign in using your name and start adding your favorite breweries. To create a new entry, simply search for the location using the map and then click <button type="button" class="btn btn-secondary">Add New Brewery</button>.
            </div>
            <div class="modal-footer">
              <button type="button" id="deleteButton" class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>   
        `
    }

    reloadPage = (e) => {
        window.location.reload();
    }
}