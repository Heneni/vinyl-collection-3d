// Simplified cratedigger.js for GitHub deployment
class Cratedigger {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.records = [];
        this.selectedRecord = -1;
        this.loadedRecords = 0;
        this.infoPanelState = 'closed';
        this.doRender = true;
        
        this.config = {
            debug: false,
            nbCrates: 3,
            recordsPerCrate: 16,
            backgroundColor: 0x1a1a1a,
            lightIntensity: 1.0,
            elements: {
                rootContainer: null,
                canvasContainer: null,
                loadingContainer: null,
                infoContainer: null
            },
            onInfoPanelOpened: () => {},
            onInfoPanelClosed: () => {},
            onLoadingEnd: () => {}
        };
        
        this.mouse = { x: 0, y: 0 };
        this.canvasWidth = 0;
        this.canvasHeight = 0;
    }

    init(params) {
        if (params) {
            Object.assign(this.config, params);
        }
        
        if (!this.config.elements.rootContainer) {
            console.error('cratedigger.js - Init failed: can not find root container element.');
            return;
        }

        this.calculateCanvasSize();
        this.initScene();
        this.bindEvents();
        this.animate();
    }

    calculateCanvasSize() {
        this.canvasWidth = this.config.elements.rootContainer.clientWidth;
        this.canvasHeight = this.config.elements.rootContainer.clientHeight;
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.config.backgroundColor);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.config.elements.canvasContainer.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, this.canvasWidth / this.canvasHeight, 0.1, 1000);
        this.camera.position.set(0, 100, 300);

        // Add lighting
        const light = new THREE.PointLight(0xFFFFFF, this.config.lightIntensity);
        light.position.set(300, 80, 0);
        this.scene.add(light);

        // Create simple record display
        this.initRecords();
    }

    initRecords() {
        for (let i = 0; i < this.config.nbCrates * this.config.recordsPerCrate; i++) {
            this.createRecord(i);
        }
    }

    createRecord(id) {
        const record = new Record(id);
        this.scene.add(record.mesh);
        this.records.push(record);
    }

    loadRecords(recordsData, shuffle, done) {
        this.showLoading(() => {
            if (shuffle) {
                recordsData = this.shuffle(recordsData);
            }

            for (let i = 0; i < this.records.length && i < recordsData.length; i++) {
                this.records[i].data = recordsData[i];
                this.records[i].setActive();
                this.records[i].updateTexture(recordsData[i].cover);
            }

            this.loadedRecords = Math.min(this.records.length, recordsData.length);
            this.recordsDataList = recordsData;

            setTimeout(() => {
                this.hideLoading(done);
                this.config.onLoadingEnd();
            }, 1000);
        });
    }

    selectRecord(id) {
        if (id < 0 || id >= this.loadedRecords) return;
        this.selectedRecord = id;
        this.updateRecordDisplay();
    }

    selectPrevRecord() {
        const prevId = this.selectedRecord <= 0 ? this.loadedRecords - 1 : this.selectedRecord - 1;
        this.selectRecord(prevId);
    }

    selectNextRecord() {
        const nextId = this.selectedRecord >= this.loadedRecords - 1 ? 0 : this.selectedRecord + 1;
        this.selectRecord(nextId);
    }

    updateRecordDisplay() {
        this.records.forEach((record, index) => {
            if (index === this.selectedRecord) {
                record.mesh.position.y = 50;
                record.mesh.scale.setScalar(1.2);
            } else {
                record.mesh.position.y = 40;
                record.mesh.scale.setScalar(1.0);
            }
        });
    }

    flipSelectedRecord() {
        if (this.records[this.selectedRecord]) {
            this.infoPanelState = 'opened';
            this.fadeIn(this.config.elements.infoContainer);
            this.config.onInfoPanelOpened();
        }
    }

    flipBackSelectedRecord() {
        if (this.infoPanelState === 'opened') {
            this.fadeOut(this.config.elements.infoContainer);
            this.infoPanelState = 'closed';
            this.config.onInfoPanelClosed();
        }
    }

    showLoading(done) {
        this.fadeIn(this.config.elements.loadingContainer);
        setTimeout(done || (() => {}), 1000);
    }

    hideLoading(done) {
        this.fadeOut(this.config.elements.loadingContainer);
        setTimeout(done || (() => {}), 1000);
    }

    fadeIn(element) {
        element.style.display = 'block';
        setTimeout(() => element.style.opacity = 1, 15);
    }

    fadeOut(element) {
        element.style.opacity = 0;
        setTimeout(() => element.style.display = 'none', 300);
    }

    bindEvents() {
        this.config.elements.rootContainer.addEventListener('wheel', (e) => {
            if (e.deltaY < 0) this.selectPrevRecord();
            else this.selectNextRecord();
            e.preventDefault();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.selectPrevRecord();
            else if (e.key === 'ArrowRight') this.selectNextRecord();
            else if (e.key === 'Enter' || e.key === ' ') this.flipSelectedRecord();
            else if (e.key === 'Escape') this.flipBackSelectedRecord();
        });
    }

    animate() {
        if (this.doRender) {
            requestAnimationFrame(this.animate.bind(this));
            this.renderer.render(this.scene, this.camera);
        }
    }

    shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    getSelectedRecord() {
        return this.records[this.selectedRecord];
    }
}

class Record {
    constructor(id) {
        this.id = id;
        this.data = null;
        this.active = false;
        this.mesh = this.createMesh();
        
        // Position records in a grid
        const col = id % 8;
        const row = Math.floor(id / 8);
        this.mesh.position.x = (col - 3.5) * 100;
        this.mesh.position.z = (row - 3) * 100;
        this.mesh.position.y = 40;
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(80, 80, 5);
        const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        return mesh;
    }

    setActive() {
        this.active = true;
        this.mesh.visible = true;
    }

    updateTexture(imageUrl) {
        if (!imageUrl) return;
        
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('Anonymous');
        loader.load(imageUrl, (texture) => {
            this.mesh.material.map = texture;
            this.mesh.material.needsUpdate = true;
        }, undefined, (error) => {
            console.log('Texture load error:', error);
        });
    }
}

window.Cratedigger = Cratedigger;