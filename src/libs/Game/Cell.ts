// Copyright 2022 Alexander Samorodov <blitzerich@gmail.com>

export type Cell = {
	type: CellTypes,
	health?: number;
	id?: number; 
}

export enum CellTypes {
	null,
	empty,
	wall,
	player,
	enemy,
	sword,
	health,
}