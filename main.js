const channelsPerPage = 12;

const menu = document.querySelector('.menu');
const menuTrack = document.querySelector('.menu-track');
const banner = document.querySelector('.banner');
const bannerContentContainer = document.querySelector('.banner-content-container')
const channelBanners = [];

const menuFadeOverlay = document.querySelector(".menu-fade-overlay");

const buttonBannerMenu = document.querySelector('.banner-button[data-action="return-to-menu"]');
const buttonBannerLaunch = document.querySelector('.banner-button[data-action="launch-channel"]');

let currentIcon;


function initMenu() {
    createIcons();
    createBanners();

    buttonBannerMenu.addEventListener("click", closeChannel);

    menuFadeOverlay.style.opacity = 0;
}

function createIcons() {

    let channelCount;
    let currentPage;

    for(channelCount = 0; channelCount < channelLayout.length; channelCount++) {

        // create new page
        if(channelCount === 0 || channelCount % channelsPerPage === 0) {
            currentPage = document.createElement('section');
            currentPage.className = "menu-page"
            menuTrack.appendChild(currentPage);
        }

        createIcon(channelLayout[channelCount], currentPage)
    }

    // fill remainder slots with empty channels
    let remainingChannelSlots = channelsPerPage - (channelCount % channelsPerPage);
    for(let i = 0; i < remainingChannelSlots; i++) {
        createIcon("disc", currentPage);
    }
}

function createIcon(channelId, menuPage) {
    let icon = document.createElement('div');
    menuPage.appendChild(icon);

    icon.className = "channel-icon"
    icon.dataset.id = channelId;

    if(channelLibrary[channelId].bannerLayout != ``) {
        // channer has a banner and thus is clickable
        icon.addEventListener("click", () => { openChannel(channelId, icon); });
        icon.dataset.clickable = "true";
    }
    else {
        icon.dataset.clickable = "false";
    }
}

function createBanners() {
    Object.keys(channelLibrary).forEach(currentChannelId => {
        let currentBannerLayout = channelLibrary[currentChannelId].bannerLayout;

        if(currentBannerLayout != ``)
        {
            let channelBanner = document.createElement('div');
            bannerContentContainer.appendChild(channelBanner);

            channelBanner.className = "banner-content";
            channelBanner.dataset.id = currentChannelId;
            channelBanner.dataset.state = "disabled";
            channelBanner.innerHTML = currentBannerLayout;

            channelBanners[currentChannelId] = channelBanner;
        }
    });
}

function disableAllBanners() {
    Object.keys(channelBanners).forEach(banner => {
        if(channelBanners[banner].dataset.state != "disabled")
            disableBanner(banner);
    });
}

function disableBanner(channelId) {
    channelBanners[channelId].dataset.state = "disabled";
}

function openChannel(channelId, icon) {
    
    currentIcon = icon;

    disableAllBanners();

    channelBanners[channelId].dataset.state = "enabled";

    menu.dataset.state = "inactive";

    banner.dataset.state = "active";
    banner.dataset.channel = channelId;

    buttonBannerLaunch.addEventListener("click", () => { launchChannel(channelId); }, {once: true});

    bannerZoom(true);
}

function closeChannel() {
    menu.dataset.state = "active"
    banner.dataset.state = "inactive";
    bannerZoom(false);
}

function bannerZoom(isZoomingIn) {
    const site = menu;
    const mover = banner;
    const target = currentIcon;
    const timing = '0.8s cubic-bezier(0.65, 0, 0.35, 1)';

    // 1. PRE-FLIGHT: Kill transitions so we can measure "static" positions
    site.style.transition = mover.style.transition = 'none';

    // If zooming out, we MUST know where we are starting from (the zoomed state)
    const startSiteTransform = getComputedStyle(site).transform;
    const startMoverTransform = getComputedStyle(mover).transform;

    // 2. MEASUREMENT: Reset to natural state to find the "Home" of the icon
    site.style.transform = 'none';
    mover.style.transform = 'none';
    
    // This is the most important line: force the browser to acknowledge the reset
    site.offsetHeight; 

    const tRect = target.getBoundingClientRect();
    const mRect = mover.getBoundingClientRect();
    const sRect = site.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 3. MATH
    const scaleAmount = mRect.width / tRect.width;
    const originX = (tRect.left + tRect.width / 2) - sRect.left;
    const originY = (tRect.top + tRect.height / 2) - sRect.top;
    
    const centerX = (vw / 2) - (mRect.width / 2) - mRect.left;
    const centerY = (vh / 2) - (mRect.height / 2) - mRect.top;

    const returnX = tRect.left - mRect.left;
    const returnY = tRect.top - mRect.top;
    const returnScale = tRect.width / mRect.width;

    const siteMoveX = (vw / 2) - (tRect.left + tRect.width / 2);
    const siteMoveY = (vh / 2) - (tRect.top + tRect.height / 2);

    // 4. SET STARTING POINT
    if (isZoomingIn) {
        // Prepare for Zoom In: Start at the icon
        site.style.transformOrigin = `${originX}px ${originY}px`;
        mover.style.transform = `translate(${returnX}px, ${returnY}px) scale(${returnScale})`;
        mover.style.opacity = 0;
    } else {
        // Prepare for Zoom Out: Must start from the current zoomed-in position
        site.style.transform = startSiteTransform;
        mover.style.transform = startMoverTransform;
    }

    // 5. TRIGGER ANIMATION
    // Double requestAnimationFrame ensures the "Starting Point" is painted first
    requestAnimationFrame(() => {
        site.offsetHeight; // One more flush for safety
        requestAnimationFrame(() => {
            site.style.transition = `transform ${timing}`;
            mover.style.transition = `all ${timing}`;
            menuFadeOverlay.style.transition = `opacity ${timing}`;

            if (isZoomingIn) {
                site.style.transform = `translate(${siteMoveX}px, ${siteMoveY}px) scale(${scaleAmount})`;
                mover.style.transform = `translate(${centerX}px, ${centerY}px) scale(1)`;
                mover.style.opacity = 1;
                menuFadeOverlay.style.opacity = 1;
            } else {
                site.style.transform = `translate(0, 0) scale(1)`;
                mover.style.transform = `translate(${returnX}px, ${returnY}px) scale(${returnScale})`;
                mover.style.opacity = 0;
                menuFadeOverlay.style.opacity = 0;

                // Cleanup after the return animation finishes
                const onEnd = (e) => {
                    if (e.target === mover) {
                        site.style.transition = mover.style.transition = 'none';
                        site.style.transform = mover.style.transform = '';
                        site.style.transformOrigin = '';
                        mover.removeEventListener('transitionend', onEnd);
                    }
                };
                mover.addEventListener('transitionend', onEnd);
            }
        });
    });
}

/* function animateBanner(iconElement) {
    console.log(iconElement);
    
    let mover = banner;
    let target = iconElement;

    // 1. KILL TRANSITION IMMEDIATELY
    // This stops any current movement dead in its tracks
    mover.style.transition = 'none';

    // 2. Reset to "Home" to get clean coordinates
    mover.style.transform = 'none';

    // 3. Force Layout Flush
    mover.offsetHeight; 

    // 4. Calculate the Snap
    const moverRect = mover.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const snapX = targetRect.left - moverRect.left;
    const snapY = targetRect.top - moverRect.top;

    const scaleRatio = targetRect.width / moverRect.width;

    // 5. SNAP to target (instantly)
    mover.style.transform = `translate(${snapX}px, ${snapY}px) scale(0.16)`;

    // 6. THE WAIT
    // We wait two frames. 
    // Frame 1: Browser acknowledges the snap.
    // Frame 2: Browser is ready to start a NEW animation from the snap point.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            mover.style.transition = 'transform 0.6s ease-out';
            
            // Calculate your Step 3 (Center) here
            const centerX = (window.innerWidth / 2) - (moverRect.width / 2) - moverRect.left;
            const centerY = (window.innerHeight / 2) - (moverRect.height / 2) - moverRect.top;
            
            mover.style.transform = `translate(${centerX}px, ${centerY}px)`;
        });
    });
}
    */

function snapToTarget(mover, target) {
    // Reset
    mover.style.transition = 'none';
    mover.style.transform = 'none';
    
    // Force Reflow
    const _ = mover.offsetHeight; 
    
    // Calculate
    const mRect = mover.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    
    // Position exactly on top
    mover.style.transform = `translate(${tRect.left - mRect.left}px, ${tRect.top - mRect.top}px)`;
}

function launchChannel(channelId) {
    // window.open(channelLibrary[channelId].launchURL, "_self"); 
    console.log(`launching url: ${channelLibrary[channelId].launchURL}`);
}

initMenu();