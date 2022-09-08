// Copyright 2022 Alexander Samorodov <blitzerich@gmail.com>

import { Cell, CellTypes } from './Cell';
import { Resources } from './Resources';
import { rand } from '../../utils/random';

export type GameState = {
	area: Cell[][];
	diffArea: {x: number; y: number}[];
	empty: number[][];
	player: {
		position: { x: number; y: number; };
		healthpoint: number;
		power: number;
	};
	enemies: {[id: string]: {
		healthpoint: number,
		position: { x: number; y: number; };
	}}
}

export const initialState: GameState = {
	area: [],
	diffArea: [],
	empty: [],
	player: {
		position: { x: 0, y: 0 },
		healthpoint: 50,
		power: 20,
	},
	enemies: {},
};

export class Game {
	private state: GameState = initialState;
	private worldInterval: number | undefined;

	readonly width = 32;
	readonly height = 20;

	public isEnd = false;

	constructor(
		private readonly container: HTMLElement,
		private readonly resources: Resources,
	) {
		this.state.area = new Array(this.height);
		for (let i = 0; i < this.height; i++) {
			this.state.area[i] = new Array(this.width);
			for (let j = 0; j < this.width; j++) {
				this.state.area[i][j] = {type: CellTypes.null};
			}
		}
	}

	public init() {
		this.isEnd = false;
		this.state.empty = [];

		this.fill(CellTypes.wall);
		this.generateRooms();
		this.generateWays();
		this.playerSpawn();
		this.healthpointSpawn(10);
		this.swordSpawn(2);
		this.enemySpawn(10);

		this.worldInterval = window.setInterval(() => {
			this.worldNext();
		}, 500);
	}

	public exit() {
		window.clearInterval(this.worldInterval);
	}

	public fill(state: CellTypes) {
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				this.state.area[i][j].type= state;

				this.state.diffArea.push({x: j, y: i});
			}
		}
	}

	public playerInfo() {
		return this.state.player;
	}	

	public playerSpawn() {
		const r = rand(0, this.state.empty.length - 1);
		const [y, x] = this.state.empty[r];
		this.state.player.position = {x, y};
		this.state.area[y][x].type= CellTypes.player;
		this.state.area[y][x].health = this.state.player.healthpoint;

		this.state.empty = [
			...this.state.empty.slice(0, r), 
			...this.state.empty.slice(r + 1),
		];

		this.state.diffArea.push({x, y});
	}

	public playerMove(direction: 'left' | 'right' | 'up' | 'down') {
		if (this.state.player.healthpoint === 0) return;
		const {x ,y} = this.state.player.position;

		let newX = x,
			newY = y;

		if (direction === 'left') newX -= 1;
		if (direction === 'right') newX += 1;
		if (direction === 'up') newY -= 1;
		if (direction === 'down') newY += 1;

		if (newX < 0) newX = this.width - 1;
		if (newX > this.width - 1) newX = 0;

		if (newY < 0) newY = this.height - 1;
		if (newY > this.height - 1) newY = 0;

		if (this.state.area[newY][newX].type=== CellTypes.wall
			|| this.state.area[newY][newX].type=== CellTypes.enemy) return;

		if (this.state.area[newY][newX].type=== CellTypes.health) {
			this.state.player.healthpoint += 15;

			if (this.state.player.healthpoint > 100) {
				this.state.player.healthpoint = 100;
			}
		}

		if (this.state.area[newY][newX].type=== CellTypes.sword) {
			this.state.player.power += 30;
		}

		this.state.area[newY][newX].type = CellTypes.player;
		this.state.area[newY][newX].health = this.state.player.healthpoint;

		this.state.area[y][x].type= CellTypes.empty;
		this.state.area[y][x].health = undefined;

		this.state.player.position = {x: newX, y: newY};

		this.state.empty = this.state.empty.filter(pos => pos[1] !== newX && pos[0] !== newY);
		this.state.empty.push([y, x]);

		this.state.diffArea.push({x, y});
		this.state.diffArea.push({x: newX, y: newY});
	}

	public playerKick() {
		if (this.state.player.healthpoint === 0) return;
		
		const {x, y} = this.state.player.position;

		const up = this.state.area[y - 1] && this.state.area[y - 1][x];
		const down= this.state.area[y + 1] && this.state.area[y + 1][x];
		const left = this.state.area[y] && this.state.area[y][x - 1];
		const right = this.state.area[y] && this.state.area[y][x + 1];
		
		const upLeft = this.state.area[y - 1] && this.state.area[y - 1][x - 1];
		const upRight = this.state.area[y - 1] && this.state.area[y - 1][x + 1];
		const downLeft = this.state.area[y + 1] && this.state.area[y + 1][x - 1];
		const downRight = this.state.area[y + 1] && this.state.area[y + 1][x + 1];

		const directions = [up, down, left, right, upLeft, upRight, downLeft, downRight];
		directions.forEach(cell => {
			if (cell.type === CellTypes.enemy) {
				cell.health! -= this.state.player.power;
				this.state.enemies[cell.id!].healthpoint = cell.health!;

				if (cell.health! <= 0) {
					this.state.enemies[cell.id!].healthpoint = 0;
					const {x, y} = this.state.enemies[cell.id!].position; 
					this.state.area[y][x].type = CellTypes.empty;
					this.state.empty.push([y, x]);

					this.state.area[y][x].id = undefined;
					this.state.area[y][x].health = undefined;
					delete this.state.enemies[cell.id!];

					this.state.diffArea.push({x, y});
				}
			}
		});
	}

	public healthpointSpawn(count: number) {
		for (let i = 0; i < count; i++) {
			const r = rand(0, this.state.empty.length - 1);
			const [y, x] = this.state.empty[r];
			this.state.area[y][x].type= CellTypes.health;

			this.state.empty = [
				...this.state.empty.slice(0, r), 
				...this.state.empty.slice(r + 1),
			];

			this.state.diffArea.push({x, y});
		}
	}

	public swordSpawn(count: number) {
		for (let i = 0; i < count; i++) {
			const r = rand(0, this.state.empty.length - 1);
			const [y, x] = this.state.empty[r];
			this.state.area[y][x].type= CellTypes.sword;

			this.state.empty = [
				...this.state.empty.slice(0, r), 
				...this.state.empty.slice(r + 1),
			];

			this.state.diffArea.push({x, y});
		}
	}

	public enemySpawn(count: number) {
		for (let i = 0; i < count; i++) {
			const r = rand(0, this.state.empty.length - 1);
			const [y, x] = this.state.empty[r];
			this.state.area[y][x].type= CellTypes.enemy;

			this.state.enemies[i] = {
				healthpoint: 100,
				position: {x, y},
			};

			this.state.empty = [
				...this.state.empty.slice(0, r), 
				...this.state.empty.slice(r + 1),
			];

			this.state.diffArea.push({x, y});
		}
	}

	public generateRooms() {
		const rc = 10;
		let c = 0;
		while(c < rc) {
			const w = rand(3, 8),
				h = rand(3, 8);

			const xOffset = rand(1, this.width - 1 - w),
				yOffset = rand(1, this.height - 1 - h);

			for (let i = yOffset; i < yOffset + h; i++) {
				for (let j = xOffset; j < xOffset + w; j++) {
					this.state.area[i][j].type= CellTypes.empty;
					this.state.empty.push([i, j]);

					this.state.diffArea.push({x: j, y: i});
				}
			}
			c++;
		}
	}

	public generateWays() {
		const horizontalCount = rand(3, 5);
		let verticalOffset = 0;
		for (let i = 0; i < horizontalCount; i++) {
			if (horizontalCount === 5) {
				verticalOffset += i === 0 ? rand(1,2) : rand(3, 4);
			} else {
				verticalOffset += i === 0 ? rand(2,3) : rand(4, 5);
			}
			

			for (let j = 0; j < this.width; j++) {
				this.state.area[verticalOffset][j].type= CellTypes.empty;

				if (this.state.empty.findIndex(pos => pos[0] === verticalOffset && pos[1] === j) !== -1) {
					continue;
				}
				this.state.empty.push([verticalOffset, j]);

				this.state.diffArea.push({x: j, y: verticalOffset});
			}
		}

		const verticalCount = rand(3, 5);
		let horizontalOffset = 0;
		for (let i = 0; i < verticalCount; i++) {
			if (verticalCount === 3) horizontalOffset += rand(6, 8);
			if (verticalCount === 4) horizontalOffset += rand(5, 7);
			if (verticalCount === 5) horizontalOffset += rand(4, 6);

			for (let j = 0; j < this.height; j++) {
				this.state.area[j][horizontalOffset].type= CellTypes.empty;
				if (this.state.empty.findIndex(pos => pos[0] === j && pos[1] === horizontalOffset) !== -1) {
					continue;
				}
				this.state.empty.push([j, horizontalOffset]);

				this.state.diffArea.push({x: horizontalOffset, y: j});
			}
		}
	}

	public worldNext() {
		Object
			.keys(this.state.enemies)
			.forEach(id => {
				const enemy = this.state.enemies[id];
				if (enemy.healthpoint === 0) return;

				const {x, y} = enemy.position;

				const directions = [];

				const upType = this.state.area[y - 1] && this.state.area[y - 1][x]?.type;
				const downType = this.state.area[y + 1] && this.state.area[y + 1][x]?.type;
				const leftType = this.state.area[y] && this.state.area[y][x - 1]?.type;
				const rightType = this.state.area[y] && this.state.area[y][x + 1]?.type;

				if (upType === CellTypes.player || downType === CellTypes.player
					|| leftType === CellTypes.player || rightType === CellTypes.player) {
					this.state.player.healthpoint -= 20;
					if (this.state.player.healthpoint <= 0) {
						this.state.player.healthpoint = 0;

						const {x, y} = this.state.player.position;
						this.state.area[y][x].type = CellTypes.empty;

						this.state.diffArea.push({x, y});
					}
					return;
				}

				if (upType === CellTypes.empty) directions.push('up');
				if (downType === CellTypes.empty) directions.push('down');
				if (leftType === CellTypes.empty) directions.push('left');
				if (rightType === CellTypes.empty) directions.push('right');

				if (directions.length === 0) {
					return;
				}

				const r = rand(0, directions.length - 1);
				const direction = directions[r];

				let newX = x,
					newY = y;
				if (direction === 'up') newY -= 1;
				if (direction === 'down') newY += 1;
				if (direction === 'left') newX -= 1;
				if (direction === 'right') newX += 1;

				this.state.area[newY][newX] = {
					type: CellTypes.enemy,
					health: enemy.healthpoint,
					id: +id,
				};
				this.state.area[y][x] = {
					type: CellTypes.empty,
					health: undefined,
					id: undefined,
				};
				this.state.enemies[id].position = {
					x: newX,
					y: newY,
				};

				this.state.diffArea.push({x, y});
				this.state.diffArea.push({x: newX, y: newY});
			});

		if (this.state.player.healthpoint === 0
			|| Object.keys(this.state.enemies).length === 0) {
			this.isEnd = true;
		}
	}

	public render() {
		if (this.container.children.length === 0) {

			for (let i = 0; i < this.height; i++) {
				const line = document.createElement('div');
				line.className = 'line cl';
		
				for (let j = 0; j < this.width; j++) {
					const cell = document.createElement('div');
					cell.className = 'cell ' + this.getClassName(this.state.area[i][j].type);

					if (this.state.area[i][j].type === CellTypes.player
					|| this.state.area[i][j].type === CellTypes.enemy) {
						const health = document.createElement('health');
						health.className = 'health';
						health.style.width = this.state.area[i][j].health! + '%';

						cell.appendChild(health);
					}

					line.appendChild(cell);
				}

				this.container.appendChild(line);
			}
			return;
		}

		this.state.diffArea.forEach(position => {
			const {x, y} = position;
			const {type, health} = this.state.area[y][x];

			const cellElement = this.container.children[y].children[x];
			cellElement.className = 'cell ' + this.getClassName(type);

			if (type === CellTypes.enemy || type === CellTypes.player) {
				if (cellElement.children[0] === undefined) {
					const healthElement = document.createElement('health');
					healthElement.className = 'health';
					healthElement.style.width = health! + '%';

					cellElement.appendChild(healthElement);
				} else {
					const healthElement = cellElement.children[0] as HTMLElement;
					healthElement.style.width = health + '%';
				}
			} else {
				if (cellElement.children[0] !== undefined) {
					cellElement.children[0].remove();
				}
			}
		});

		this.state.diffArea = [];
	}

	private getClassName(state: number) {
		const entity = CellTypes[state];
		return this.resources[entity].className;
	}
}