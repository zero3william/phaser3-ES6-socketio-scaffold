import Phaser from 'phaser';
import io from 'socket.io-client';

class PlayGame extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayGame' });
  }

  init() {}

  preload() {
    this.load.image('bg', '../assets/sprites/bg.jpg');
  }

  create() {
    this.add.image(195, 350, 'bg');
  }

  update(time, delta) {}
}

export default PlayGame;
