import Phaser from 'phaser';
import io from 'socket.io-client';

let socket;
let room;
let self_color;
let tileList = [];
let mainboard;

const offsetX = 31 + 50;
const offsetY = 35 + 50;
class PlayGame extends Phaser.Scene {
  constructor() {
    super({ key: 'PlayGame' });
  }

  init(data) {
    socket = data.socket;
    room = data.room;

    socket.on('disconnect', () => {
      console.log('server disconnect');
      this.scene.start('Menu');
    });

    socket.on('stopGame', () => {
      console.log('someone Leave');
      socket.close();
      this.scene.start('Menu');
    });

    const exitBtn = this.add.text(300, 20, '離開此桌', {
      fill: '#f33',
      fontSize: '18px'
    });
    exitBtn.setInteractive();
    exitBtn.on('pointerup', () => {
      socket.close();
    });

    self_color = socket.id === room.green ? 'green' : 'blue';
    mainboard = this.add.container(0, 100, [this.add.image(195, 250, 'bg')]);
    room.pieceList.forEach((piece, index) => {
      const x = offsetX + 117 * piece.x;
      const y = offsetY + 115 * piece.y;
      tileList[index] = this.add.image(x, y, piece.type);
      tileList[index].color = piece.owner;
      if (piece.owner === 'blue') {
        tileList[index].angle = 180;
      }
      mainboard.add(tileList[index]);
    });

    if (self_color === 'blue') {
      mainboard.angle = 180;
      mainboard.x = 390;
      mainboard.y = 600;
    }

    mainboard.iterate(obj => {
      if (self_color === obj.color) {
        obj.setInteractive();
      }
    });

    //listen event
    this.input.on('gameobjectdown', this.touchStartOnTile);
  }

  preload() {}

  create() {}

  update(time, delta) {}

  touchStartOnTile(e, tile) {
    // console.log('x', e.x);
    // console.log('y', e.y);
    // console.log('tile', tile);
    const scene = this.scene;

    //compute correct area
    //show correct area
  }

  getTileByPosition(x, y) {}
}

export default PlayGame;
