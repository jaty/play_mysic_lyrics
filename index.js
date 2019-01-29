const LyricsLoader = {
    playerSongInfo: document.getElementById('playerSongInfo'),
    playerControls: document.getElementsByClassName('material-player-middle'),

    playerElements: {
        title: 'currently-playing-title',
        artist: 'player-artist'
    },

    currentSong: {
        title: null,
        artist: null
    },

    loadTextButton: null,
    textPopup: null,

    init: function () {
        this.initObserver();
        document.addEventListener('click', this.onClick.bind(this), false);
    },

    initObserver: function() {
        let observer = new MutationObserver(this.onSongChange.bind(this));
        observer.observe(this.playerSongInfo, {
            childList: true
        });
    },

    onSongChange: function (mutations, observer) {
        this.getSongData();

        if (!this.loadTextButton) {
            this.renderButton();
        }

        this.hideText();
        this.fetchText();
    },

    onClick: function(event) {
        if (!this.loadTextButton && !this.textPopup) {
            return;
        }

        let eventEl = event.target || event.srcElement;
        if (eventEl.id != this.loadTextButton.id) {
            this.hideText();
            return;
        }

        this.loadTextButton.removeAttribute('title');
        this.loadTextButton.classList.toggle('active');
    },

    renderButton: function() {
        this.loadTextButton = document.createElement('div');
        this.loadTextButton.id = 'load-text';
        this.loadTextButton.className = 'load_text_btn';

        this.playerControls[0].appendChild(this.loadTextButton);

        this.textPopup = document.createElement('div');
        this.textPopup.className = 'tooltiptext';

        this.loadTextButton.appendChild(this.textPopup);
    },

    hideText: function() {
        this.loadTextButton.classList.remove('active');
    },

    getSongData: function() {
        let songTitleEl = document.getElementById(this.playerElements.title);
        let songArtistEl = document.getElementById(this.playerElements.artist);

        this.currentSong.title = songTitleEl.textContent;
        this.currentSong.artist = songArtistEl.textContent;
    },

    fetchText: function() {
        let artist = this.currentSong.artist.toLowerCase().replace(/[^A-Za-z0-9]+/g, '').replace(/^the/, '');
        let song = this.currentSong.title.toLowerCase().replace(/[^A-Za-z0-9]+/g, '');

        chrome.runtime.sendMessage({
            contentScriptQuery: 'fetchUrl',
            url: 'http://www.azlyrics.com/lyrics/' + artist + '/' + song + '.html'
        }, response => {
            this.textPopup.innerHTML = '<div>' + response + '</div>';
        });
    }
}

LyricsLoader.init();
