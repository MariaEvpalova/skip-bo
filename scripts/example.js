<button id="startButton">Start</button>
<button id="stopButton">Stop</button>

<script>
let intervalId = null;

document.getElementById('startButton').addEventListener('click', function() {
    if (intervalId === null) { // Prevent multiple intervals from being created
        intervalId = setInterval(() => {
            console.log('This function is executed every 1 second');
        }, 1000);
        console.log('Interval started.');
    }
});

document.getElementById('stopButton').addEventListener('click', function() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null; // Reset the intervalId
        console.log('Interval stopped.');
    }
});
</script>
