import Phaser from 'phaser';
import io from 'socket.io-client';

let count;
let countText;
let prevTime;
class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  init() {}

  preload() {
    this.load.image('bg', '../assets/sprites/bg.jpg');
    this.load.image('lion', '../assets/sprites/lion.png');
    this.load.image('elephant', '../assets/sprites/elephant.png');
    this.load.image('giraffe', '../assets/sprites/giraffe.png');
    this.load.image('chick', '../assets/sprites/chick.png');
    this.load.image('chicken', '../assets/sprites/chicken.png');
  }

  create() {
    this.add.image(195, 350, 'bg');
    const startBtn = this.add.text(115, 150, '開始遊戲', {
      fill: '#363',
      fontSize: '40px'
    });
    startBtn.setInteractive();
    startBtn.on('pointerup', () => {
      this.socket = io('http://localhost:8080');
      this.socket.on('connect', () => {
        startBtn.visible = false;
        stopBtn.visible = true;
        countText.visible = true;
        countText.setText(`搜索中... 0s`);
        count = false;

        this.socket.on('gameStart', room => {
          this.scene.start('PlayGame', { socket: this.socket, room: room });
        });
      });
    });

    const stopBtn = this.add.text(115, 150, '停止配對', {
      fill: '#f33',
      fontSize: '30px'
    });
    stopBtn.visible = false;
    stopBtn.setInteractive();
    stopBtn.on('pointerup', () => {
      this.socket.close();
      startBtn.visible = true;
      stopBtn.visible = false;
      countText.visible = false;
    });

    countText = this.add.text(50, 250, `搜索中... 0s`, {
      fill: '#363',
      fontSize: '40px'
    });
    countText.visible = false;
  }

  update(time, delta) {
    if (count === false) {
      prevTime = time;
      count = 0;
      return 0;
    }
    if (time - prevTime >= 1000) {
      countText.setText(`搜索中... ${++count}s`);
      prevTime += 1000;
      return 0;
    }
  }
}

export default Menu;
