// Copyright 2022 Alexander Samorodov <blitzerich@gmail.com>


export const rand = (min: number, max: number) => {
	return Math.round(min - 0.5 + Math.random() * (max - min + 1));
};