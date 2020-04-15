import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import * as THREE from 'three';
import "./EnableThreeExamples2";
import "three/examples/js/controls/OrbitControls";
import "three/examples/js/loaders/ColladaLoader";
import "three/examples/js/loaders/OBJLoader";
import {TaxiService} from './taxi.service'
import {Position} from '../BLC/blc.model'
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-taxi',
    templateUrl: './taxi.component.html',
})
export class TaxiComponent implements AfterViewInit {

    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private cameraTarget: THREE.Vector3;
    public scene: THREE.Scene;

    public fieldOfView: number = 60;
    public nearClippingPane: number = 1;
    public farClippingPane: number = 5100;

    public controls: THREE.OrbitControls;

    public MainTime: number;

    // Lights ////
    public cL1 = [false, false, false];
    public cL2 = [false, false, false];
    public cL3 = [false, false, false];

    public pL1 = [false, false];
    public pL2 = [false, false];
    public pL3 = [false, false];
    public pL4 = [false, false];

    public AllSprite: any[] = []


    @ViewChild('canvas')
    private canvasRef: ElementRef;

    constructor(private taxiService: TaxiService) {
        this.render = this.render.bind(this);
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private createScene() {
        this.scene = new THREE.Scene();
        this.createGroundGrid();
        this.createRoadAndJuction();

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

        let component: TaxiComponent = this;

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
        event.preventDefault();

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
        this.createLight();
        this.createCamera();
        this.startRendering();
        this.addControls();
        this.render();


        setInterval(() => {
            this.CreateSprint((this.randomInteger(1,7)).toString(),
                (this.randomInteger(1,7)).toString(),
                    (this.randomInteger(1,7)).toString(),
                        (this.randomInteger(1,7)).toString());
        }, 2000)

        // this.taxiService.get().subscribe(
        //     (res: any) => {
        //         console.log(res)
        //     },
        //     (res: HttpErrorResponse) => console.log('error'));
    }

    private CreateSprint(m1: string, m2: string, m3: string, m4: string) {

        if(this.AllSprite.length > 0){
            this.deleteAllSprite();
        }
        var sprite = this.makeTextSprite(m1, {}, new Position(150, 200));
        this.AllSprite.push(sprite.uuid)
        this.scene.add(sprite);

        var sprite2 = this.makeTextSprite(m2, {}, new Position(540, -30));
        this.AllSprite.push(sprite2.uuid)
        this.scene.add(sprite2);

        var sprite3 = this.makeTextSprite(m3, {}, new Position(800, 350));
        this.AllSprite.push(sprite3.uuid)
        this.scene.add(sprite3);

        var sprite4 = this.makeTextSprite(m4, {}, new Position(400, 600))
        this.AllSprite.push(sprite4.uuid)
        this.scene.add(sprite4);
        this.render();

    }

    private deleteAllSprite(){
        this.scene.remove(this.scene.getObjectByProperty('uuid', this.AllSprite[0]));
        this.scene.remove(this.scene.getObjectByProperty('uuid', this.AllSprite[1]));
        this.scene.remove(this.scene.getObjectByProperty('uuid', this.AllSprite[2]));
        this.scene.remove(this.scene.getObjectByProperty('uuid', this.AllSprite[3]));
        this.AllSprite = [];
        this.render();
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

    private update_all_frame(AllDataFromBackend: any) {
        this.MainTime = 25490;
        setInterval(() => {
            var AllPedesFromBackend = [];
            var AllCarFromBackend = [];
            this.MainTime++;
            if (this.MainTime > 32247) {
                this.MainTime = 25490;
            }

            this.render();

        }, 1000 / 20);
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


    private randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}








