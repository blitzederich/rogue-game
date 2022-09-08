// Copyright 2022 Alexander Samorodov <blitzerich@gmail.com>

import './polyfill';
import './style.css';

import { Game } from './libs/Game/Game';

const container = document.getElementsByClassName('field')[0] as HTMLElement;
const resources = {
	empty: { className: 'tile' },
	wall: { className: 'tileW' },
	player: { className: 'tileP' },
	enemy: { className: 'tileE' },
	sword: { className: 'tileSW' },
	health: { className: 'tileHP' },
};

const game = new Game(container, resources);
game.init();

const FRAME_RATE = 60;
setInterval(() => {
	const {healthpoint, power} = game.playerInfo();
	
	document.getElementById('hp')!.innerHTML = ''+healthpoint;
	document.getElementById('power')!.innerHTML = ''+power;

	game.render();
}, 1000 / FRAME_RATE);


let coolDown = false;
window.addEventListener('keydown', (e) => {
	if (coolDown) return;

	if (e.code === 'Space' || e.key === 'Spacebar') game.playerKick();

	if (e.code === 'KeyW' || e.key == 'w' || e.key === 'ц' 
		|| e.code === 'ArrowUp'   || e.key === 'Up') game.playerMove('up');

	if (e.code === 'KeyS' || e.key == 's' || e.key === 'ы' 
		|| e.code === 'ArrowDown' || e.key === 'Down') game.playerMove('down');

	if (e.code === 'KeyA' || e.key == 'a' || e.key === 'ф' 
		|| e.code === 'ArrowLeft' || e.key === 'Left') game.playerMove('left');

	if (e.code === 'KeyD' || e.key == 'd' || e.key === 'в' 
		|| e.code === 'ArrowRight'|| e.key === 'Right') game.playerMove('right');

	coolDown = true;
	setTimeout(() => coolDown = false, 1000 / FRAME_RATE);
});