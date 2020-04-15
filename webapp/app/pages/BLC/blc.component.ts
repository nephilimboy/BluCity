import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import * as THREE from 'three';
import "./EnableThreeExamples";
import "three/examples/js/controls/OrbitControls";
import "three/examples/js/loaders/ColladaLoader";
import "three/examples/js/loaders/OBJLoader";
import {Car, Pedestrian, Position} from './blc.model'
import {BlcService} from './blc.service'
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-blc',
    styleUrls: ['./blc.component.scss'],
    templateUrl: './blc.component.html',
})
export class BlcComponent implements AfterViewInit {

    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private cameraTarget: THREE.Vector3;
    public scene: THREE.Scene;

    public fieldOfView: number = 60;
    public nearClippingPane: number = 1;
    public farClippingPane: number = 5100;

    public controls: THREE.OrbitControls;

    public humanGeo: any = null;
    private ArrayCars: Car[] = [];
    private ArrayPedestrians: Pedestrian[] = [];

    public MainTime: number;

    // Lights ////
    public cL1 = [false, false, false];
    public cL2 = [false, false, false];
    public cL3 = [false, false, false];

    public pL1 = [false, false];
    public pL2 = [false, false];
    public pL3 = [false, false];
    public pL4 = [false, false];


    @ViewChild('canvas')
    private canvasRef: ElementRef;

    constructor(private blcService: BlcService) {
        this.render = this.render.bind(this);
        this.loadHumanGeo = this.loadHumanGeo.bind(this);
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private createScene() {
        this.scene = new THREE.Scene();
        // this.scene.add(new THREE.AxisHelper(200));

        this.createGroundGrid();
        this.createRoadAndJuction();
        this.createGuideBox();

        var loader = new THREE.OBJLoader();
        loader.load('../../../assets/obj/human.obj', this.loadHumanGeo);
    }

    private createLight() {
        var light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 0, 100);
        this.scene.add(light);

        var light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 0, -100);
        this.scene.add(light);
    }

    private createCamera() {
        let aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );

        // Set position and look at
        this.camera.position.x = 500;
        this.camera.position.y = 500;
        this.camera.position.z = 500;
    }

    private getAspectRatio(): number {
        let height = this.canvas.clientHeight;
        if (height === 0) {
            return 0;
        }
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private startRendering() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.autoClear = true;

        let component: BlcComponent = this;

        (function render() {
            //requestAnimationFrame(render);
            component.render();
        }());
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

    public addControls() {
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.addEventListener('change', this.render);
        this.controls.target.set(304, 0, -447);
    }

    /* EVENTS */

    public onMouseDown(event: MouseEvent) {
        // console.log("onMouseDown");
        event.preventDefault();

        // Example of mesh selection/pick:
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);

        var obj: THREE.Object3D[] = [];
        this.findAllObjects(obj, this.scene);
        var intersects = raycaster.intersectObjects(obj);
        // console.log("Scene has " + obj.length + " objects");
        // console.log(intersects.length + " intersected objects found")
        intersects.forEach((i) => {
            // console.log(i.object); // do what you want to do with object
        });

    }

    private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
        // NOTE: Better to keep separate array of selected objects
        if (parent.children.length > 0) {
            parent.children.forEach((i) => {
                pred.push(i);
                this.findAllObjects(pred, i);
            });
        }
    }

    public onMouseUp(event: MouseEvent) {
        // console.log("onMouseUp");
    }


    @HostListener('window:resize', ['$event'])
    public onResize(event: Event) {
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        // console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.render();
    }

    @HostListener('document:keypress', ['$event'])
    public onKeyPress(event: KeyboardEvent) {
        // console.log("onKeyPress: " + event.key);
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
        this.createScene();
        this.CreateSprint();
        this.createLight();
        this.createCamera();
        this.startRendering();
        this.addControls();
        this.render();

        // this.cL1[1] = true;
        // this.cL2[2] = true;
        // this.cL3[1] = true;
        // this.pL1[0] = true;
        // this.pL2[1] = true;
        // this.pL3[1] = true;
        // this.pL4[0] = true;

        // setInterval(() => {
        //     this.cL1[1] = false;
        //     this.cL1[2] = true;
        // }, 5000)

        this.blcService.getTimeStampData(25489).subscribe(
            (res: any) => {
                this.blcService.getDiagram().subscribe(
                    (res2: any) => {
                        this.update_all_frame(res.body, res2)
                    },(res2: HttpErrorResponse) => console.log('error'));
            },
            (res: HttpErrorResponse) => console.log('error'));

    }

    private CreateSprint() {
        this.scene.add(this.makeTextSprite('1', {}, new Position(150, 200)));
        this.scene.add(this.makeTextSprite('2', {}, new Position(540, -30)));
        this.scene.add(this.makeTextSprite('3', {}, new Position(800, 350)));
        this.scene.add(this.makeTextSprite('4', {}, new Position(400, 600)));
    }

    private makeTextSprite(message, parameters, position: Position) {
        if (parameters === undefined) parameters = {};
        var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
        var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 100;
        var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
        var borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        };
        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ? parameters["backgroundColor"] : {
            r: 255,
            g: 255,
            b: 255,
            a: 1.0
        };
        var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : {r: 0, g: 0, b: 0, a: 1.0};

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;
        var metrics = context.measureText(message);
        var textWidth = metrics.width;

        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        // roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

        context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
        context.fillText(message, borderThickness, fontsize + borderThickness);

        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({map: texture});
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(position.y, 60, -position.x);
        // sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
        sprite.scale.set(fontsize, fontsize, fontsize);
        return sprite;
    }

    private checkTheLightColor(litghColor: string){
        if (litghColor == 'red'){
            return [false, false, true];
        }else if (litghColor == 'green'){
            return [true, false, false];
        }else {
            return [false, true, false];
        }

    }
    private checkTheLightColorPedes(litghColor: string){
        if (litghColor == 'red'){
            return [false, true];
        }else{
            return [true, false];
        }
    }

    private update(AllDataFromBackend: []) {
        var AllPedesFromBackend = [];
        var AllCarFromBackend = [];
        AllDataFromBackend.forEach((obj: any) => {
            if (obj.type === 1) {
                AllCarFromBackend.push(obj)
            } else if (obj.type === 2 || obj.type === 3) {
                AllPedesFromBackend.push(obj)
            }
        });

        ////////////////////////////////   Pedestrians   ////////////////////////////////
        for (var i = 0; i < this.ArrayPedestrians.length; i++) {
            var theObjectExistInCurrentMap = false;
            AllPedesFromBackend.forEach((obj) => {
                if (this.ArrayPedestrians[i].id == obj.id) {
                    // Obj is still in map so update its position
                    var object = this.scene.getObjectByProperty('uuid', (this.ArrayPedestrians[i]).uuid);
                    object.position.set(obj.y, 0, -obj.x);
                    this.ArrayPedestrians[i].position.x = obj.x;
                    this.ArrayPedestrians[i].position.y = obj.y;
                    theObjectExistInCurrentMap = true;
                }
            })
            if (!theObjectExistInCurrentMap) {
                // Obj is not exist in the current map so delete it from the scene
                this.removePedestrian(this.ArrayPedestrians[i].uuid);
            }
        }
        // Adding new obj to the scene
        AllPedesFromBackend.forEach((obj) => {
            var theObjectInCurrentMapIsExistInScene = false;
            for (var i = 0; i < this.ArrayPedestrians.length; i++) {
                if (obj.id == this.ArrayPedestrians[i].id) {
                    theObjectInCurrentMapIsExistInScene = true;
                    break;
                }
            }
            if (!theObjectInCurrentMapIsExistInScene) {
                this.addPedestrian(new Position(obj.x, obj.y), (obj.id).toString())
            }
        });
        ////////////////////////////////   Cars   ////////////////////////////////
        for (var i = 0; i < this.ArrayCars.length; i++) {
            var theObjectExistInCurrentMap = false;
            AllCarFromBackend.forEach((obj) => {
                if (this.ArrayCars[i].id == obj.id) {
                    // Obj is still in map so update its position
                    var object = this.scene.getObjectByProperty('uuid', (this.ArrayCars[i]).uuid);
                    object.position.set(obj.y, 30, -obj.x);
                    this.ArrayCars[i].position.x = obj.x;
                    this.ArrayCars[i].position.y = obj.y;
                    theObjectExistInCurrentMap = true;
                }
            });
            if (!theObjectExistInCurrentMap) {
                // Obj is not exist in the current map so delete it from the scene
                this.removeCar(this.ArrayCars[i].uuid);
            }
        }
        // Adding new obj to the scene
        AllCarFromBackend.forEach((obj) => {
            var theObjectInCurrentMapIsExistInScene = false;
            for (var i = 0; i < this.ArrayCars.length; i++) {
                if (obj.id == this.ArrayCars[i].id) {
                    theObjectInCurrentMapIsExistInScene = true;
                    break;
                }
            }
            if (!theObjectInCurrentMapIsExistInScene) {
                this.addCar(new Position(obj.x, obj.y), (obj.id).toString())
            }
        });
        this.render();
    }

    private update_all_frame(AllDataFromBackend: any, alllight: any) {
        this.MainTime = 25490;
        setInterval(() => {
            var AllPedesFromBackend = [];
            var AllCarFromBackend = [];
            this.MainTime++;
            if (this.MainTime > 32247) {
                this.MainTime = 25490;
            }
            ////////////////////// LiGHTS //////////////////////////////////////////////
            alllight[this.MainTime].forEach((obj: any) =>{
                this.cL1 = this.checkTheLightColor(obj.cl1);
                this.cL2 = this.checkTheLightColor(obj.cl2);
                this.cL3 = this.checkTheLightColor(obj.cl3);
                this.pL1 = this.checkTheLightColorPedes(obj.pl1);
                this.pL2 = this.checkTheLightColorPedes(obj.pl2);
                this.pL3 = this.checkTheLightColorPedes(obj.pl3);
                this.pL4 = this.checkTheLightColorPedes(obj.pl4);
            });


            //////////////////////// PED + CARS //////////////////////////////////////////
            AllDataFromBackend[this.MainTime].forEach((obj: any) => {
                if (obj.type === 1 || obj.type === 3) {
                    AllCarFromBackend.push(obj)
                } else if (obj.type === 2) {
                    AllPedesFromBackend.push(obj)
                }
            });
            ////////////////////////////////   Pedestrians   ////////////////////////////////
            for (var i = 0; i < this.ArrayPedestrians.length; i++) {
                var theObjectExistInCurrentMap = false;
                AllPedesFromBackend.forEach((obj) => {
                    if (this.ArrayPedestrians[i].id == obj.id) {
                        // Obj is still in map so update its position
                        var object = this.scene.getObjectByProperty('uuid', (this.ArrayPedestrians[i]).uuid);
                        object.position.set(obj.y, 0, -obj.x);
                        this.ArrayPedestrians[i].position.x = obj.x;
                        this.ArrayPedestrians[i].position.y = obj.y;
                        theObjectExistInCurrentMap = true;
                    }
                })
                if (!theObjectExistInCurrentMap) {
                    // Obj is not exist in the current map so delete it from the scene
                    this.removePedestrian(this.ArrayPedestrians[i].uuid);
                }
            }
            // Adding new obj to the scene
            AllPedesFromBackend.forEach((obj) => {
                var theObjectInCurrentMapIsExistInScene = false;
                for (var i = 0; i < this.ArrayPedestrians.length; i++) {
                    if (obj.id == this.ArrayPedestrians[i].id) {
                        theObjectInCurrentMapIsExistInScene = true;
                        break;
                    }
                }
                if (!theObjectInCurrentMapIsExistInScene) {
                    this.addPedestrian(new Position(obj.x, obj.y), (obj.id).toString(), false)
                }
            });
            ////////////////////////////////   Cars   ////////////////////////////////
            for (var i = 0; i < this.ArrayCars.length; i++) {
                var theObjectExistInCurrentMap = false;
                AllCarFromBackend.forEach((obj) => {
                    if (this.ArrayCars[i].id == obj.id) {
                        // Obj is still in map so update its position
                        var object = this.scene.getObjectByProperty('uuid', (this.ArrayCars[i]).uuid);
                        object.position.set(obj.y, 30, -obj.x);
                        this.ArrayCars[i].position.x = obj.x;
                        this.ArrayCars[i].position.y = obj.y;
                        theObjectExistInCurrentMap = true;
                    }
                });
                if (!theObjectExistInCurrentMap) {
                    // Obj is not exist in the current map so delete it from the scene
                    this.removeCar(this.ArrayCars[i].uuid);
                }
            }
            // Adding new obj to the scene
            AllCarFromBackend.forEach((obj) => {
                var theObjectInCurrentMapIsExistInScene = false;
                for (var i = 0; i < this.ArrayCars.length; i++) {
                    if (obj.id == this.ArrayCars[i].id) {
                        theObjectInCurrentMapIsExistInScene = true;
                        break;
                    }
                }
                if (!theObjectInCurrentMapIsExistInScene) {
                    this.addCar(new Position(obj.x, obj.y), (obj.id).toString(), false)
                }
            });
            this.render();

       }, 1000 / 20);
       //  }, 5000);
    }

    /* Loading Init Shapes */
    private loadHumanGeo(collada) {
        this.humanGeo = collada;
    }

    private createGroundGrid() {
        var t = 15
        var g = new THREE.PlaneGeometry(2000, 2000, t, t);
        g.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI * 0.5));
        var g_mat = new THREE.MeshBasicMaterial({color: 0x4d4d4d, wireframe: true});
        g_mat.opacity = 0.25;
        g_mat.transparent = true;
        var ground = new THREE.Mesh(g, g_mat);
        this.scene.add(ground);
        // var d = 14 * 0.5;
        ground.position.set(305, 1, -447);
    }

    private createRoadAndJuction() {
        // Road Material
        var junc_mat = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('../../../assets/materials/junction.png')});
        junc_mat.transparent = true;

        var junc_plan = new THREE.PlaneBufferGeometry(1001, 779);
        junc_plan.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI * 0.5));
        var junc = new THREE.Mesh(junc_plan, junc_mat);
        this.scene.add(junc);
        junc.position.set(304, 0, -447);
    }

    private createGuideBox() {
        ////////////////////// #1 ////////////////////////////
        var geo = this.twoDObjectBox(450, 379, 666, 723, 585, 480, 320, 424);
        var material = new THREE.MeshBasicMaterial({color: "#02fc1c", wireframe: true, transparent: true});
        var cube = new THREE.Mesh(geo, material);
        this.scene.add(cube);
        ////////////////////// #2 ////////////////////////////
        var geo = this.twoDObjectBox(203, 136, 374, 431, 260, 137, 12, 107);
        var material = new THREE.MeshBasicMaterial({color: "#02fc1c", wireframe: true, transparent: true});
        var cube = new THREE.Mesh(geo, material);
        this.scene.add(cube);
        ////////////////////// #3 ////////////////////////////
        var geo = this.twoDObjectBox(480, 602, 761, 657, 116, 52, 238, 304);
        var material = new THREE.MeshBasicMaterial({color: "#02fc1c", wireframe: true, transparent: true});
        var cube = new THREE.Mesh(geo, material);
        this.scene.add(cube);
        ////////////////////// #4 ////////////////////////////
        var geo = this.twoDObjectBox(127, 219, 365, 247, 333, 274, 479, 538);
        var material = new THREE.MeshBasicMaterial({color: "#02fc1c", wireframe: true, transparent: true});
        var cube = new THREE.Mesh(geo, material);
        this.scene.add(cube);


        // var color = this.getRandomColor();
        // var geoo = new THREE.BoxGeometry(10, 10, 10)
        // var mesh = new THREE.MeshBasicMaterial({color: color});
        // var cube = new THREE.Mesh(geoo, mesh);
        // this.scene.add(cube);
        // cube.position.set(137, 2.5, -561);
        // this.render();
    }

    private twoDObjectBox(x1, x2, x3, x4, y1, y2, y3, y4) {
        /*
    6----7
   /|   /|
  2----3 |
  | |  | |
  | 4--|-5
  |/   |/
  0----1
*/
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(y1, 1, -x1),  // 0
            new THREE.Vector3(y2, 1, -x2),  // 1
            new THREE.Vector3(y1, 60, -x1),  // 2
            new THREE.Vector3(y2, 60, -x2),  // 3
            new THREE.Vector3(y3, 1, -x3),  // 4
            new THREE.Vector3(y4, 1, -x4),  // 5
            new THREE.Vector3(y3, 60, -x3),  // 6
            new THREE.Vector3(y4, 60, -x4),  // 7
        );
        geometry.faces.push(
            // front
            new THREE.Face3(0, 3, 2),
            new THREE.Face3(0, 1, 3),
            // right
            new THREE.Face3(1, 7, 3),
            new THREE.Face3(1, 5, 7),
            // back
            new THREE.Face3(5, 6, 7),
            new THREE.Face3(5, 4, 6),
            // left
            new THREE.Face3(4, 2, 6),
            new THREE.Face3(4, 0, 2),
            // top
            new THREE.Face3(2, 7, 6),
            new THREE.Face3(2, 3, 7),
            // bottom
            new THREE.Face3(4, 1, 0),
            new THREE.Face3(4, 5, 1),
        );
        return geometry;
    }

    /* Add/Remove Objects */
    private addCar(position: Position, id: string, ColorChange = true) {
        let car = new Car();
        car.id = id;
        car.position = position;
        var color;

        if (ColorChange) {
            color = this.getRandomColor();
        } else {
            color = '#00ffa7'
        }
        var geo = new THREE.BoxGeometry(30, 20, 30)
        var mesh = new THREE.MeshBasicMaterial({color: color});
        var cube = new THREE.Mesh(geo, mesh);
        car.uuid = cube.uuid;
        this.scene.add(cube);
        cube.position.set(position.y, 30, -position.x);
        this.ArrayCars.push(car);
        this.render();
    }

    private removeCar(uuid: string) {
        this.scene.remove(this.scene.getObjectByProperty('uuid', uuid));
        this.render();
        this.ArrayCars = this.ArrayCars.filter(x => x.uuid !== uuid)
    }

    private addPedestrian(position: Position, id: string, ColorChange = true) {
        let pedestrian = new Pedestrian();
        pedestrian.id = id;
        pedestrian.position = position;
        let geo = this.humanGeo.clone();
        var color;
        if (ColorChange) {
            color = this.getRandomColor();
        } else {
            color = '#ff8700'
        }
        geo.traverse(child => {
            if (child.material) child.material = new THREE.MeshBasicMaterial({color: color});
        });
        geo.scale.set(15, 15, 15);
        pedestrian.uuid = geo.uuid;
        this.scene.add(geo);
        geo.position.set(position.y, 0, -position.x);
        this.ArrayPedestrians.push(pedestrian);
        this.render();
    }

    private removePedestrian(uuid: string) {
        this.scene.remove(this.scene.getObjectByProperty('uuid', uuid));
        this.render();
        this.ArrayPedestrians = this.ArrayPedestrians.filter(x => x.uuid !== uuid)
    }

    /* Add/Remove Objects */
    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    private randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}








// this.addPedestrian(new Position(this.randomInteger(1, 40), this.randomInteger(1, 40)));
// this.addCar(new Position(this.randomInteger(1, 40), this.randomInteger(1, 40)));
// this.addPedestrian(new Position(this.randomInteger(1, 40), this.randomInteger(1, 40)));
// this.addPedestrian(new Position(this.randomInteger(1, 40), this.randomInteger(1, 40)));
// console.log('========== pedes full ================')
// console.log(this.ArrayPedestrians)
// console.log('========================================')
//
// var allUuid = []
// this.ArrayPedestrians.forEach((pedes)=>{
//     allUuid.push(pedes.uuid)
// })
// var length = allUuid.length
// for (var i =0; i < length; i++){
//     this.removePedestrian(allUuid[i])
//     console.log(this.ArrayPedestrians)
// }
// console.log('************************************************')




// var MainTime = 25489;
// while (MainTime <= 32248) {
//     cnt++;
//     this.blcService.getTimeStampData(MainTime).subscribe(
//         (res: any) => {
//             this.update(res.body)
//         },
//         (res: HttpErrorResponse) => console.log('error'))
//
//     setInterval(() => {
//         console.log('TimeStamp is: ' + MainTime)
//     }, 5000);
//     MainTime = 25489 + cnt * 5;
// }

//
// setInterval(() => {
//     this.blcService.getTimeStampData(25489 + cnt * 2 ).subscribe(
//         (res: any) => {
//             this.update(res.body)
//         },
//         (res: HttpErrorResponse) => console.log('error'));
//     cnt++;
// }, 2000);