import Phaser from 'phaser';
import PlayGame from './scenes/PlayGame';
import Menu from './scenes/Menu';

const config = {
  type: Phaser.AUTO,
  width: 390,
  height: 600,
  parent: 'content',
  scene: [Menu, PlayGame],
  backgroundColor: 0xdff1fb
};

class Client extends Phaser.Game {
  constructor() {
    super(config);
  }
}

export default Client;
