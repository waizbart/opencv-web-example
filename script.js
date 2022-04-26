const video = document.getElementById("video-input");
const canvas = document.getElementById("canvas-output");

(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });

    video.srcObject = stream;
    video.play();

    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat();
    let cap = new cv.VideoCapture(video);
    let faces = new cv.RectVector()
    console.log(faces)
    let classifier = new cv.CascadeClassifier();
    let utils = new Utils();
    let faceCascadeFile = 'haarcascade_frontalface_default.xml';

    utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
        classifier.load(faceCascadeFile);
    });

    const FPS = 30;

    function processVideo() {
        let begin = Date.now();

        cap.read(src);

        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

        try {
            classifier.detectMultiScale(gray, faces, 1.1, 2, 0);
        } catch (err) {
            console.log(err);
        }
        for (let i = 0; i < faces.size(); ++i) {
            let face = faces.get(i);
            let point1 = new cv.Point(face.x, face.y);
            let point2 = new cv.Point(face.x + face.width, face.y + face.height);
            cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
        }

        cv.imshow("canvas-output", src);

        // atualização de frames
        let delay = 1000 / FPS - (Date.now() - begin);

        setTimeout(processVideo, delay);
    }

    setTimeout(processVideo, 0);
})()