const overlay = document.querySelector('.channel-overlay');
const channels = document.querySelectorAll('.channel');

channels.forEach(channel => {
    channel.addEventListener("click", openChannel);
});

overlay.addEventListener("click", closeChannel);

function openChannel() {
    overlay.dataset.state = "visible";
}

function closeChannel() {
    overlay.dataset.state = "hidden";
}