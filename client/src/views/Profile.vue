<template>
    <div>
        <video id="videoElement" controls crossOrigin="anonymous"></video>
        <canvas id="canvasElement"></canvas>
        <button @click="captureFrame">Capture Frame</button>
    </div>
</template>

<script>
export default {
    mounted() {
        const videoElement = document.getElementById('videoElement');
        videoElement.src =
            'http://res.cloudinary.com/dakwyskfm/video/upload/v1685873595/upload_videos/64718588fafe4f23737b3ec7/vtnr7klpo9ob6vtfdsfq.mp4'; // Set the path to your video file
    },
    methods: {
        async captureFrame() {
            const videoElement = document.getElementById('videoElement');
            const canvasElement = document.getElementById('canvasElement');
            const context = canvasElement.getContext('2d');

            // Set canvas dimensions to match the video element
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;

            // Draw the current frame on the canvas
            context.drawImage(
                videoElement,
                0,
                0,
                canvasElement.width,
                canvasElement.height,
            );

            // Capture the frame as an image
            const imageData = await canvasElement.toDataURL();
            console.log(videoElement); // Do something with the captured frame, e.g., save it or display it
        },
    },
};
</script>
