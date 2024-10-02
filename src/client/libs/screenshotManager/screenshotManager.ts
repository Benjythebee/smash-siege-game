import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RenderPixelatedPass } from './shaders/RenderPixelatedPass.js';
import { PixelatePass } from './shaders/PixelatePass.js';
import { Camera } from '@react-three/fiber';
const screenshotSize = 2048;

export type Shots = 'fullshot' | 'cowboyshot' | 'closeup' | 'mediumcloseup' | 'mediumshot' | 'mediumcloseupshot' | 'closeupshot';

const localVector = new THREE.Vector3();

class PixelRenderer {
  domElement: HTMLCanvasElement;
  _renderPixelPass: RenderPixelatedPass;
  _pixelPass: PixelatePass;

  renderer: THREE.WebGLRenderer;
  composer: EffectComposer;

  constructor(
    public scene: THREE.Scene | THREE.Object3D,
    public camera: THREE.Camera,
    public pixelSize: number
  ) {
    const pixelRenderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: false,
      alpha: true
    });

    this.domElement = pixelRenderer.domElement;

    const screenshotResolution = new THREE.Vector2(screenshotSize, screenshotSize);
    pixelRenderer.setClearColor(0x000000, 0);
    pixelRenderer.outputColorSpace = THREE.SRGBColorSpace;
    pixelRenderer.setSize(screenshotResolution.x, screenshotResolution.y);
    pixelRenderer.setPixelRatio(window.devicePixelRatio);
    //pixelRenderer.shadowMap.enabled = true

    let renderResolution = screenshotResolution.clone().divideScalar(pixelSize);
    renderResolution.x |= 0;
    renderResolution.y |= 0;

    const composer = new EffectComposer(pixelRenderer);
    composer.addPass(new RenderPass(scene as THREE.Scene, camera));

    this._renderPixelPass = new RenderPixelatedPass(renderResolution, scene, camera);
    this._pixelPass = new PixelatePass(renderResolution);

    composer.addPass(this._renderPixelPass);

    composer.addPass(this._pixelPass);

    this.renderer = pixelRenderer;
    this.composer = composer;
  }
  setSize(width: number, height: number) {
    const screenshotResolution = new THREE.Vector2(width, height);
    let renderResolution = screenshotResolution.clone().divideScalar(this.pixelSize);
    renderResolution.x |= 0;
    renderResolution.y |= 0;

    this.renderer.setSize(width, height);
    this._renderPixelPass.setResolution(renderResolution);
    this._pixelPass.setResolution(renderResolution);
  }
  setPixelSize(pixelSize: number) {
    this.pixelSize = pixelSize;
  }
  render() {
    this.composer.render();
  }
}

export class ScreenshotManager {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  sceneBackground: THREE.Color;
  pixelRenderer: PixelRenderer;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: true
    });
    this.renderer.setClearAlpha(0);
    (this.renderer as any).premultipliedAlpha = false;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer.setSize(screenshotSize, screenshotSize);

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
    this.sceneBackground = new THREE.Color(0.1, 0.1, 0.1);

    this.pixelRenderer = new PixelRenderer(scene, this.camera, 20);
  }
  setScene(scene: THREE.Scene) {
    this.scene = scene;
  }

  getImageData(width: number, height: number, pixelSize: number | null = null) {
    return this._createImage(width, height, pixelSize);
  }

  setCamera(cameraObject: Camera) {
    this.camera = cameraObject.clone(false);
    this.camera.position.y += 4;
    this.camera.position.z += 2;
    this.camera.rotateX(0.3);
    (this.camera as THREE.PerspectiveCamera).fov = 85;
  }

  _createImage(width: number, height: number, pixelSize: number | null = null) {
    const aspectRatio = width / height;
    if (typeof pixelSize === 'number') {
      this.pixelRenderer.setPixelSize(pixelSize);
    }
    this.renderer.setSize(width, height);
    this.pixelRenderer.setSize(width, height);
    const strMime = 'image/png';

    if ('aspect' in this.camera) {
      this.camera.aspect = aspectRatio;
    }
    this.camera.updateProjectionMatrix();
    const renderer = typeof pixelSize === 'number' ? this.pixelRenderer : this.renderer;
    try {
      renderer.render(this.scene, this.camera);
      let imgData = renderer.domElement.toDataURL(strMime);
      return imgData;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  saveScreenshot(imageName: string, width: number, height: number) {
    const imgData = this._createImage(width, height);
    if (!imgData) throw new Error('saveScreenshot: Error creating image');
    const strDownloadMime = 'image/octet-stream';
    const strMime = 'image/png';
    this.saveFile(imgData.replace(strMime, strDownloadMime), imageName + '.png');
  }
  private saveFile(strData: string, filename: string) {
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link); //remove the link when done
    } else {
      const win = window.open(strData, '_blank');
      if (!win) {
        console.error('Error opening new window');
        return;
      }
      win.document.write('<title>' + filename + "</title><img src='" + strData + "'/>");
    }
  }
}
