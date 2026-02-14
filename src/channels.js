const channelLayout = ["disc", "lastfm"];

const channelLibrary = {
    "empty": {   
        iconLayout:`
            <div class="mii-grid-preview">
                <div class="mii-head"></div>
                <div class="mii-head"></div>
            </div>`,
        bannerLayout: ``,
        launchURL: "",
        displayName: ""
    },
    
    "disc": {
        iconLayout:`
            <div class="mii-grid-preview">
                <div class="mii-head"></div>
                <div class="mii-head"></div>
            </div>`,
        bannerLayout:`
            <div class="mii-grid-preview">
                <div class="mii-head"></div>
                <div class="mii-head"></div>
            </div>`,
        launchURL: "",
        displayName: "Disc Channel"
    },

    "lastfm": {
        iconLayout:`
            <div class="mii-grid-preview">
                <div class="mii-head"></div>
                <div class="mii-head"></div>
            </div>`,
        bannerLayout:`
            <p>last.fm</p>`,
        launchURL: "https://www.last.fm/user/broodroost3r",
        displayName: "last.fm Channel"
    }
}