/**
 * Created by mahua on 2017/6/5.
 */

var particles, particle;

var scene, camera, renderer;

var mouseX = 0, mouseY = 0;

var AMOUNTX = 10, AMOUNTY = 10, AMOUNTZ = 10;

var SEPARATION = 500;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var targets = {grid: [], sphere: [], cube: [], plane: [], back: []};
var positionX = 0, positionY = 0;
var watchOverCount = 0;

init();

// render update
animate();
function init() {

    var canvasdiv = document.createElement("div");
    canvasdiv.id = "Background";
    canvasdiv.style.position = "fixed";
    canvasdiv.style.top = 0;
    canvasdiv.style.left = 0;
    canvasdiv.style.zIndex = -1;

// create a camera (fov aspect nearplane farplane) PerspectiveCamera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
// set camera to z to 200
    camera.position.z = 200;

// create scene to add sprite
    scene = new THREE.Scene();

    scene.background = 0x000000;
// array to save sprite
    particles = [];
// make circle with Canvas
    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial( {

        color : 0xdddddd,

        program : function (context) {
            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();
        }
    });
// add particle to scene and save in
    var i = 0;


    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            for (var iz = 0; iz < AMOUNTZ; iz++) {
                particle = particles[i++] = new THREE.Sprite(material);
                particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                particle.position.y = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                particle.position.z = iz * SEPARATION - ((AMOUNTZ * SEPARATION) / 2);
                particle.scale.multiplyScalar(15);
                scene.add(particle);
            }
        }
    }

// grid

    for (var ig = 0; ig < particles.length; ig++) {
        var object = new THREE.Object3D();
        object.copy(particles[ig]);
        targets.grid.push(object);

    }

// sphere

    for (var is = 0; is < particles.length; is++) {
        var object = new THREE.Object3D();
        object.position.x = Math.random() * 2 - 1;
        object.position.y = Math.random() * 2 - 1;
        object.position.z = Math.random() * 2 - 1;
        object.position.normalize();
        object.position.multiplyScalar(Math.random() * 10 + 450);
        object.scale.multiplyScalar(5);
        targets.sphere.push(object);
    }

// cube

    var vector = new THREE.Vector3();

    for (var i = 0; i < particles.length; i++) {
        var object = new THREE.Object3D();

        object.copy(particles[i]);
        object.position.multiplyScalar(0.2);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        targets.cube.push(object);
    }

// wave

    for (var iw = 0; iw < particles.length; iw++) {
        var object = new THREE.Object3D();
        object.copy(particles[iw]);
        object.position.multiplyScalar(0.5);

        object.position.y = 0;

        targets.plane.push(object);
    }

// back

    for (var i = 0; i < particles.length; i++) {
        var object = new THREE.Object3D();
        var vector = new THREE.Vector3(0, 0, 0);
        object.position = vector;
        object.scale.multiplyScalar(0.01);
        targets.back.push(object);
    }
// add renderer
    renderer = new THREE.CanvasRenderer({
        antialias: true,
    });
// set pixelratio to make retina can play
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.autoClear = true;
    renderer.setClearColor(0x000000);


// add in dom
    canvasdiv.appendChild(renderer.domElement);
    document.body.appendChild(canvasdiv);
// listen mouse move
    document.addEventListener("mousemove", onMouseMove, false);
// rerender windows size
    window.addEventListener("resize", onWindowResize, false);

}

function onWindowResize() {
// make true mouse on the true point
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
// change aspect then windows change
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onMouseMove(event) {
// return mouse position
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function animate() {
// rerender page
    requestAnimationFrame(animate);
// make camera to move with mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05 + positionX;
    camera.position.y += (- mouseY - camera.position.y) * 0.05 + positionY;
// lookat scene
    camera.lookAt(scene.position);

    render();
    TWEEN.update();

}
// render
function render() {
    renderer.render(scene, camera);
}

var page = document.createElement("div");
page.id = "Text";
document.body.appendChild(page);

function mainPageText(sectionID, ele) {
    var section = document.createElement("section");
    section.id = sectionID;
    section.appendChild(ele);
    page.appendChild(section);
    return section;
}

function tagAndWord(tag, someChild) {
    var word = document.createElement(tag);
    word.appendChild(someChild);
    return word;
}

function textNode(text) {
    var word = document.createTextNode(text);
    return word;
}

var title = function () {
    var head = document.createElement("h1");
    head.appendChild(document.createTextNode("Motion "));
    var changecolor = document.createElement("span");
    changecolor.style.color = "#29F";
    changecolor.appendChild(document.createTextNode("G"));
    head.appendChild(changecolor);
    head.appendChild(document.createTextNode("round"));
    head.className = "title";
    return head;
};
var mainTitle = mainPageText("Title", tagAndWord("header", title()));


var next = function () {
    var div = document.createElement("div");

    div.id = "nextPage";
    var down = document.createElement("div");
    down.className = "downSharp";
    div.appendChild(down);
    return div;

};

var introText = function () {
    var introWord = "Motion ground is a Demo. It's make from ";

    var threejs = "Three.js";
    var dot = ".";
    var threejsUrl = "https://threejs.org";
    var someword = "You can move mouse to move camera.";
    var introChild = tagAndWord("p", textNode(introWord));

    var url = tagAndWord("a", textNode(threejs));
    url.href = threejsUrl;
    introChild.appendChild(url);
    introChild.appendChild(textNode(dot));
    introChild.appendChild(document.createElement("br"));
    introChild.appendChild(textNode(someword));
    var intro = tagAndWord("div", introChild);
    intro.className = "pageforintro";
    var introNext = tagAndWord("a", next());
    introNext.id = "ToSphere";
    introNext.href = "#Sphere";
    intro.appendChild(introNext);
    return intro;

};
mainTitle.appendChild(introText());


var sphereTitle = function () {
    var S = "S";
    var phere = "phere";
    var span = tagAndWord("span", document.createTextNode(S));
    span.style.color = "#ff39d1";
    var head = tagAndWord("h1", span);
    head.appendChild(document.createTextNode(phere));
    head.className = "title sphere";
    return head;
};

var secondPage = mainPageText("Sphere", tagAndWord("header", sphereTitle()));

var sphereText = function () {
    var sphereWord = "It's a sphere with some noise, Math.random is useful.";

    var someword = "You can move mouse to move camera.";
    var sphereChild = tagAndWord("p", textNode(sphereWord));
    sphereChild.appendChild(document.createElement("br"));
    sphereChild.appendChild(textNode(someword));
    var intro = tagAndWord("div", sphereChild);
    intro.className = "pageforintro";
    var Next = tagAndWord("a", next());
    Next.id = "ToCube";
    Next.href = "#Cube";
    intro.appendChild(Next);
    return intro;

};

secondPage.appendChild(sphereText());

var cubeText = function () {
    var cubeWord = "Cube with particles, model is so likely gird.",
        anotherword = " So I used same model and change position.";

    var someword = "You can move mouse to move camera.";
    var cubeChild = tagAndWord("p", textNode(cubeWord));
    cubeChild.appendChild(document.createElement("br"));
    cubeChild.appendChild(textNode(anotherword));
    cubeChild.appendChild(document.createElement("br"));
    cubeChild.appendChild(textNode(someword));
    var intro = tagAndWord("div", cubeChild);
    intro.className = "pageforintro";
    var Next = tagAndWord("a", next());
    Next.id = "ToPlane";
    Next.href = "#Plane";
    intro.appendChild(Next);
    return intro;

};

var cubeTitle = function () {
    var C = "C";
    var ube = "ube";
    var span = tagAndWord("span", document.createTextNode(C));
    span.style.color = "#54dd6d";
    var head = tagAndWord("h1", span);
    head.appendChild(document.createTextNode(ube));
    head.className = "title cube";
    return head;
};

var thirdPage = mainPageText("Cube", tagAndWord("header", cubeTitle()));
thirdPage.appendChild(cubeText());

var planeText = function () {
    var planeWord = "Plane is useful to make 3D. Do you think so?";
    var someword = "You can move mouse to move camera.";
    var planeChild = tagAndWord("p", textNode(planeWord));
    planeChild.appendChild(document.createElement("br"));
    planeChild.appendChild(textNode(someword));
    var intro = tagAndWord("div", planeChild);
    intro.className = "pageforintro";
    var Next = tagAndWord("a", next());
    Next.id = "ToEnd";
    Next.href = "#End";
    intro.appendChild(Next);
    return intro;

};

var planeTitle = function () {
    var P = "P";
    var lane = "lane";
    var span = tagAndWord("span", document.createTextNode(P));
    span.style.color = "#41ffff";
    var head = tagAndWord("h1", span);
    head.appendChild(document.createTextNode(lane));
    head.className = "title plane";
    return head;
};

var forthPage = mainPageText("Plane", tagAndWord("header", planeTitle()));
forthPage.appendChild(planeText());

var EndTitle = function () {
    var E = "E";
    var nd = "nd";
    var span = tagAndWord("span", document.createTextNode(E));
    span.style.color = "#dd3132";
    var head = tagAndWord("h1", span);
    head.appendChild(document.createTextNode(nd));
    head.className = "title end";
    return head;
};

var ret = function () {
    var div = document.createElement("div");

    div.id = "returnMain";
    var down = document.createElement("p");
    down.appendChild(document.createTextNode("Back to Main"));
    down.className = "returnText";
    div.appendChild(down);
    return div;

};

var gotoCode = function () {
    var div = document.createElement("div");

    div.id = "gotoCode";
    var down = document.createElement("p");
    down.appendChild(document.createTextNode("View Code"));
    down.className = "returnText";
    div.appendChild(down);
    return div;

};

var endText = function () {
    var endWord = "Thank you for your watching. You can back and watching again to change with menu.";
    var endChild = tagAndWord("p", textNode(endWord));
    var intro = tagAndWord("div", endChild);
    intro.className = "pageforintro";
    var Return = tagAndWord("a", ret());
    Return.id = "ToReturn";
    Return.href = "#";
    var gotoI = tagAndWord("a", gotoCode());
    gotoI.id = "GotoOther";
    gotoI.href = "./js/webgl.js";
    gotoI.style.display = "none";
    intro.appendChild(Return);
    intro.appendChild(gotoI);
    return intro;

};


var endPage = mainPageText("End", tagAndWord("header", EndTitle()));
endPage.appendChild(endText());

var introToSphere = document.getElementById("ToSphere");
var sphereToCube = document.getElementById("ToCube");
var cubeToPlane = document.getElementById("ToPlane");
var planeToEnd = document.getElementById("ToEnd");
var endToIntro = document.getElementById("ToReturn");

introToSphere.onclick = function () {
    $('html,body').animate({scrollTop: $('#Sphere').offset().top}, 1500);
    return false;
};

sphereToCube.onclick = function () {
    $('html,body').animate({scrollTop: $('#Cube').offset().top}, 1500);
    return false;
};

cubeToPlane.onclick = function () {
    $('html,body').animate({scrollTop: $('#Plane').offset().top}, 1500);
    return false;
};

planeToEnd.onclick = function () {
    $('html,body').animate({scrollTop: $('#End').offset().top}, 1500);
    return false;
};

var list = ["Intro", "Sphere", "Cube", "Plane", "End"];
var idList = ["#Title", "#Sphere", "#Cube", "#Plane", "#End"];

var nav = function () {
    navDiv = document.createElement("div");
    navDiv.id = "nav";
    var navUl = document.createElement("ul");
    for (var i = 0; i < 5; i++) {
        var div = document.createElement("li");
        div.className = "nav-li";
        div.id = list[i] + "li";
        var link = document.createElement("a");
        link.id = "a" + list[i];
        link.href = idList[i];
        link.appendChild(document.createTextNode(list[i]));
        div.appendChild(link);
        navUl.appendChild(div);
    }
    navDiv.appendChild(navUl);
    return navDiv;
};

document.body.appendChild(nav());

var linkToList1 = document.getElementById("a" + list[0]);
var linkToList2 = document.getElementById("a" + list[1]);
var linkToList3 = document.getElementById("a" + list[2]);
var linkToList4 = document.getElementById("a" + list[3]);
var linkToList5 = document.getElementById("a" + list[4]);

linkToList1.onclick = function () {
    $('html,body').animate({scrollTop: $(idList[0]).offset().top}, 1500);
    return false;
};
linkToList2.onclick = function () {
    $('html,body').animate({scrollTop: $(idList[1]).offset().top}, 1500);
    return false;
};
linkToList3.onclick = function () {
    $('html,body').animate({scrollTop: $(idList[2]).offset().top}, 1500);
    return false;
};
linkToList4.onclick = function () {
    $('html,body').animate({scrollTop: $(idList[3]).offset().top}, 1500);
    return false;
};
linkToList5.onclick = function () {
    $('html,body').animate({scrollTop: $(idList[4]).offset().top}, 1500);
    return false;
};

var getNavId = document.getElementById("nav");

getNavId.style.display = "none";

endToIntro.onclick = function () {
    $('html,body').animate({scrollTop: $('#Title').offset().top}, 1500);
    $('#nav').fadeIn();
    $('#GotoOther').fadeIn();
    return false;
};

$(document).ready(function () {
    $(window).scroll(
        function (event) {
            if ($(document).scrollTop() < 20){
                transform(targets.grid, 2000);
                new TWEEN.Tween(camera.position).to({z: 200}, 2000).easing(TWEEN.Easing.Exponential.InOut).start();
                positionX = 0;
                positionY = 0;
                if (watchOverCount != 0 && getNavId.style.display == "none") {
                    $('#nav').fadeIn();
                    $('#GotoOther').fadeIn();
                }
                highLight(list[0]);
            } else if ($(document).scrollTop() >= $("#Sphere").offset().top - 20 && $(document).scrollTop() < $("#Cube").offset().top - 20) {
                transform(targets.sphere, 2000);
                new TWEEN.Tween(camera.position).to({z: 1000}, 2000).easing(TWEEN.Easing.Exponential.InOut).start();
                camera.lookAt(scene.position);
                positionX = 0;
                positionY = 0;
                highLight(list[1]);
            } else if ($(document).scrollTop() >= $("#Cube").offset().top - 20 && $(document).scrollTop() < $("#Plane").offset().top - 20){
                transform(targets.cube, 2000);
                new TWEEN.Tween(camera.position).to({z: 1000}, 2000).easing(TWEEN.Easing.Exponential.InOut).start();
                positionX = 40;
                positionY = 50;
                highLight(list[2]);
            } else if ($(document).scrollTop() >= $("#Plane").offset().top - 20 && $(document).scrollTop() < $("#End").offset().top - 20) {
                transform(targets.plane, 2000);
                new TWEEN.Tween(camera.position).to({z: 200}, 2000).easing(TWEEN.Easing.Exponential.InOut).start();
                positionX = 0;
                positionY = 0;

                highLight(list[3]);
            } else if ($(document).scrollTop() >= $("#End").offset().top - 20){
                transform(targets.back, 2000);
                new TWEEN.Tween(camera.position).to({z: 200}, 2000).easing(TWEEN.Easing.Exponential.InOut).start();
                positionX = 0;
                positionY = 0;
                watchOverCount += 1;

                highLight(list[4]);
            } else {
                transform(targets.grid, 2000);
                new TWEEN.Tween(camera.position).to({z: 200}, 2000).easing(TWEEN.Easing.Exponential.InOut).start();
                positionX = 0;
                positionY = 0;
            }

        }
    );
});

function highLight(para) {
    $("#" + para + 'li').addClass("highLight");
    for (var i = 0; i < list.length; i++) {
        if (list[i] != para) {
            $("#" + list[i] + "li").removeClass("highLight");
        }
    }
}

function transform(targetsIn, duration) {
    TWEEN.removeAll();

    for (var i = 0; i < particles.length; i++) {
        var obj = particles[i];
        var tar = targetsIn[i];
        new TWEEN.Tween(obj.position)
            .to({
                x: tar.position.x,
                y: tar.position.y,
                z: tar.position.z
            }, duration + duration * Math.random())
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(obj.scale)
            .to({
                x: tar.scale.x,
                y: tar.scale.y,
                z: tar.scale.z
            }, duration + duration * Math.random())
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();


    }
    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

}

