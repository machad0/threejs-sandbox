let camera,
    controls,
    scene,
    renderer,
    height,
    width,
    rendererIframe,
    sphere

function init() {
    const container = document.getElementById('container');

    width = window.innerWidth;
    height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.x = 0.1;

    scene = new THREE.Scene();

    rendererIframe = new THREE.CSS3DRenderer();
    rendererIframe.setSize(width, height);
    rendererIframe.domElement.style.position = 'absolute';
    rendererIframe.domElement.style.top = 0;
    container.appendChild(rendererIframe.domElement);

    const LoaderTexture = new THREE.TextureLoader();
    const texture = LoaderTexture.load('assets/img/texture.jpg');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(100, 20, 20),
        new THREE.MeshBasicMaterial({
            map: texture
        })
    );

    const group = new THREE.Group();

    window.util.loadJSON('config.json', data => {
        data = JSON.parse(data);
        const elements = data.elements.map(element => new Element(element.url, element.width, element.height,
                           element.x, element.y, element.z, element.ry, element.rx, element.rz));

        elements.forEach(element => {
            group.add(element);
        });

        scene.add(group);

    });

    window.addEventListener('resize', onWindowResize, false);

    sphere.scale.x = -1;
    scene.add(sphere);

    //group.add(new Element('http://www.facebook.com', 500, 200, -300, 3 / 100, 100, 0));

    const w = 800,
	  h = 800;

    let lon = 0,
	lat = 0;

    const mouseCtrl = ev => {
        const mx = ev.movementX || ev.mozMovementX || ev.webkitMovementX || 0;
        const my = ev.movementY || ev.mozMovementY || ev.webkitMovementY || 0;
        lat = Math.min(Math.max(-Math.PI / 2, lat - my * 0.01), Math.PI / 2);
        lon = lon - mx * 0.01;

        const rotm = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(lat, lon, 0, "YXZ"));
        camera.quaternion.copy(rotm);
    };

    window.addEventListener("mousedown", ev => {
        window.addEventListener("mousemove", mouseCtrl, false);
    }, false);

    window.addEventListener("mouseup", ev => {
        window.removeEventListener("mousemove", mouseCtrl, false);
    }, false);

    const eyem = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));

    const d2r = Math.PI / 180;

    const getOrientation = () => {

        if (window.screen.orientation) return window.screen.orientation.angle;
        // Safari
        if (typeof window.orientation === "number") return window.orientation;
        // android firefox
        if (window.screen.mozOrientation) return {
            "portrait-primary": 0,
            "portrait-secondary": 180,
            "landscape-primary": 90,
            "landscape-secondary": 270,
        }[window.screen.mozOrientation];

        return 0;
    };

    const gyroSensor = ev => {
        ev.preventDefault();
        const angle = getOrientation();
        const alpha = ev.alpha || 0;
        const beta = ev.beta || 0;
        const gamma = ev.gamma || 0;
        if (alpha === 0 && beta === 0 && gamma === 0) return;

        const rotType = (angle === 0 || angle === 180) ? "YXZ" : "YZX";
        const rotm = new THREE.Quaternion().setFromEuler(new THREE.Euler(beta * d2r, alpha * d2r, -gamma * d2r, rotType));
        const devm = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -angle * d2r, 0));
        rotm.multiply(devm).multiply(eyem);
        camera.quaternion.copy(rotm);
    };

    container.addEventListener("deviceorientation", gyroSensor, false);
    animate();
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    rendererIframe.render(scene, camera);
}
