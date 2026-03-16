/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 * 
 * This example created by Prof. Evan Suma Rosenberg
 */

import * as gfx from 'gophergfx'
import { GUI } from 'dat.gui'

export class ExampleApp extends gfx.GfxApp
{
    private cameraControls: gfx.OrbitControls;
    private character: gfx.Node3;
    public morphAlpha: number;
    private targetMesh = "3";
    private startColor = new gfx.Color(0, 0.5, 0.5);
    private targetColor = new gfx.Color(1.0, 0.0, 0);
    private ground : gfx.Mesh3;

    constructor()
    {
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);
        this.character = new gfx.Node3();
        this.morphAlpha = 0;
    }

    createScene(): void 
    {
        // Setup camera
        this.camera.setPerspectiveCamera(60, 1920/1080, .1, 20)
        this.cameraControls.setTargetPoint(new gfx.Vector3(0, 1, 0));
        this.cameraControls.setDistance(3);

        // Set a black background
        this.renderer.background.set(0, 0, 0);
        
        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.25, 0.25, 0.25));
        this.scene.add(ambientLight);

        // Create a directional light
        const pointLight = new gfx.PointLight(new gfx.Color(1.25, 1.25, 1.25));
        pointLight.position.set(2, 1, 3)
        this.scene.add(pointLight);

        // Create the ground
        this.ground = gfx.Geometry3Factory.createBox(5, 1, 5);
        this.ground.material.setColor(this.startColor);
        this.ground.position.y = -0.5;
        this.scene.add(this.ground);

        

        this.character.add(this.loadMorphMesh(
            './assets/LinkBody1.obj', 
            './assets/LinkBody' + this.targetMesh + '.obj', 
            './assets/LinkBody.png'
        ));

        this.character.add(this.loadMorphMesh(
            './assets/LinkEquipment1.obj', 
            './assets/LinkEquipment' + this.targetMesh + '.obj', 
            './assets/LinkEquipment.png'
        ));

        this.character.add(this.loadMorphMesh(
            './assets/LinkEyes1.obj', 
            './assets/LinkEyes' + this.targetMesh + '.obj', 
            './assets/LinkEyes.png'
        ));

        this.character.add(this.loadMorphMesh(
            './assets/LinkFace1.obj', 
            './assets/LinkFace' + this.targetMesh + '.obj', 
            './assets/LinkSkin.png'
        ));

        this.character.add(this.loadMorphMesh(
            './assets/LinkHair1.obj', 
            './assets/LinkHair' + this.targetMesh + '.obj', 
            './assets/LinkBody.png'
        ));

        this.character.add(this.loadMorphMesh(
            './assets/LinkHands1.obj', 
            './assets/LinkHands' + this.targetMesh + '.obj', 
            './assets/LinkSkin.png'
        ));

        this.character.add(this.loadMorphMesh(
            './assets/LinkMouth1.obj', 
            './assets/LinkMouth' + this.targetMesh + '.obj', 
            './assets/LinkBody.png'
        ));

        this.scene.add(this.character);

        // Create a simple GUI
        const gui = new GUI();
        gui.width = 200;

        const morphController = gui.add(this, 'morphAlpha', 0, 1);
         morphController.name('Alpha');
         morphController.onChange(() => { 
            for(let i=0; i < this.character.children.length; i++)
            {
                const morphMesh = this.character.children[i] as gfx.MorphMesh3;
                morphMesh.morphAlpha = this.morphAlpha;
            }
        });
    }

    update(deltaTime: number): void 
    {
        const jumpPosition = new gfx.Vector3(0, 0.5, 1);
        this.character.position.lerp(gfx.Vector3.ZERO, jumpPosition, this.morphAlpha);

        this.cameraControls.update(deltaTime);
    }

    private loadMorphMesh(meshFile1: string, meshFile2: string, textureFile: string): gfx.MorphMesh
    {
        // Create morph mesh
        const morphMesh = new gfx.MorphMesh3();

        morphMesh.material.side = gfx.Side.DOUBLE;

        gfx.MeshLoader.loadOBJ(meshFile1, (loadedMesh: gfx.Mesh3)=>{
            morphMesh.positionBuffer = loadedMesh.positionBuffer;
            morphMesh.normalBuffer = loadedMesh.normalBuffer;
            morphMesh.texCoordBuffer = loadedMesh.texCoordBuffer;
            morphMesh.colorBuffer = loadedMesh.colorBuffer;
            morphMesh.indexBuffer = loadedMesh.indexBuffer;
            morphMesh.vertexCount = loadedMesh.vertexCount;
            morphMesh.triangleCount = loadedMesh.triangleCount;
        });

        // Load and copy buffer data from the second mesh into the morph buffers
        gfx.MeshLoader.loadOBJ(meshFile2, (loadedMesh: gfx.Mesh3)=>{
            morphMesh.morphTargetPositionBuffer = loadedMesh.positionBuffer;
            morphMesh.morphTargetNormalBuffer = loadedMesh.normalBuffer;
        });

        // Load the texture and assign it to the material
        morphMesh.material.texture = new gfx.Texture(textureFile);

        return morphMesh;
    }
}