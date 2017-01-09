'use strict';

Element = function Element(url, width, height, x, y, z, ry, rx, rz) {
    console.log('ELEMENT');
    var div = document.createElement('div');

    div.id = 'videoFrame';
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    div.style.backgroundColor = '#000';

    var iframe = document.createElement('iframe');
    iframe.style.width = width;
    iframe.style.height = height;
    iframe.style.border = '0';
    iframe.src = url;
    div.appendChild(iframe);

    var object = new THREE.CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.x = rx;
    object.rotation.y = ry;
    object.rotation.z = rz;

    return object;
};