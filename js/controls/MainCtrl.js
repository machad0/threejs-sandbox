'use strict';

var camera, controls, scene, renderer, height, width, rendererIframe, sphere;

function init() {
    var container = document.getElementById('container');

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

    var LoaderTexture = new THREE.TextureLoader();
    var texture = LoaderTexture.load('assets/img/texture.jpg');

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(100, 20, 20),
        new THREE.MeshBasicMaterial({
            map: texture
        })
    );

    var group = new THREE.Group();

    window.util.loadJSON('config.json', function(data) {
        data = JSON.parse(data);
        var elements = data.elements.map(function(element) {
            return new Element(element.url, element.width, element.height,
                               element.x, element.y, element.z, element.ry, element.rx, element.rz);
        });

        elements.forEach(function(element) {
            group.add(element);
        });

        scene.add(group);

    }.bind(this));

    window.addEventListener('resize', onWindowResize, false);

    sphere.scale.x = -1;
    scene.add(sphere);
    //group.add(new Element('http://www.facebook.com', 500, 200, -300, 3 / 100, 100, 0));

    var w = 800,
        h = 800;

    var lon = 0;
    var lat = 0;

    var mouseCtrl = function(ev) {
        var mx = ev.movementX || ev.mozMovementX || ev.webkitMovementX || 0;
        var my = ev.movementY || ev.mozMovementY || ev.webkitMovementY || 0;
        lat = Math.min(Math.max(-Math.PI / 2, lat - my * 0.01), Math.PI / 2);
        lon = lon - mx * 0.01;

        var rotm = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(lat, lon, 0, "YXZ"));
        camera.quaternion.copy(rotm);
    };

    window.addEventListener("mousedown", function(ev) {
        window.addEventListener("mousemove", mouseCtrl, false);
    }, false);

    window.addEventListener("mouseup", function(ev) {
        window.removeEventListener("mousemove", mouseCtrl, false);
    }, false);

    var eyem = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));

    var d2r = Math.PI / 180;

    var getOrientation = function() {

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

    // FIX: get the right rotation func for mobile and fuse with touchscreen action!!!
    // try: http://stackoverflow.com/questions/35283320/three-js-rotate-camera-with-both-touch-and-device-orientation

    var gyroSensor = function(ev) {
        ev.preventDefault();
        var angle = getOrientation();
        var alpha = ev.alpha || 0;
        var beta = ev.beta || 0;
        var gamma = ev.gamma || 0;
        if (alpha === 0 && beta === 0 && gamma === 0) return;

        var rotType = (angle === 0 || angle === 180) ? "YXZ" : "YZX";
        var rotm = new THREE.Quaternion().setFromEuler(new THREE.Euler(beta * d2r, alpha * d2r, -gamma * d2r, rotType));
        var devm = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -angle * d2r, 0));
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
    //controls.update();
    renderer.render(scene, camera);
    rendererIframe.render(scene, camera);
}
