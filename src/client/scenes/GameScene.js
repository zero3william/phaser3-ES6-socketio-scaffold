import Phaser from 'phaser';
import io from 'socket.io-client';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {}

  preload() {
    this.load.image('bg', '../assets/sprites/bg.jpg');
  }

  create() {
    this.add.image(0, 0, 'bg');
    this.socket = io('http://localhost:8080');
    this.socket.on('connect', () => {});
  }

  update(time, delta) {}
}

export default GameScene;
