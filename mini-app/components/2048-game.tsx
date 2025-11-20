"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const GRID_SIZE = 4;
const TILE_VALUES = [2, 4];
const TILE_PROBABILITIES = [0.9, 0.1];

function getRandomTile() {
  const rand = Math.random();
  return rand < TILE_PROBABILITIES[0] ? TILE_VALUES[0] : TILE_VALUES[1];
}

function cloneGrid(grid: number[][]) {
  return grid.map(row => [...row]);
}

export default function Game2048() {
  const [grid, setGrid] = useState<number[][]>(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const addRandomTile = useCallback(() => {
    const empty: [number, number][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const newGrid = cloneGrid(grid);
    newGrid[r][c] = getRandomTile();
    setGrid(newGrid);
  }, [grid]);

  const initGame = useCallback(() => {
    const newGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
    addRandomTile();
    addRandomTile();
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, [addRandomTile]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const move = useCallback((direction: "up" | "down" | "left" | "right") => {
    if (gameOver) return;
    const rotate = (g: number[][], times: number) => {
      let res = g;
      for (let i = 0; i < times; i++) {
        const newG: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            newG[c][GRID_SIZE - 1 - r] = res[r][c];
          }
        }
        res = newG;
      }
      return res;
    };

    const compress = (g: number[][]) => {
      const newG: number[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
      for (let r = 0; r < GRID_SIZE; r++) {
        let pos = 0;
        for (let c = 0; c < GRID_SIZE; c++) {
          if (g[r][c] !== 0) {
            newG[r][pos] = g[r][c];
            pos++;
          }
        }
      }
      return newG;
    };

    const merge = (g: number[][]) => {
      let gained = 0;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE - 1; c++) {
          if (g[r][c] !== 0 && g[r][c] === g[r][c + 1]) {
            g[r][c] *= 2;
            g[r][c + 1] = 0;
            gained += g[r][c];
          }
        }
      }
      return { newGrid: g, gained };
    };

    let rotated = grid;
    let times = 0;
    if (direction === "up") times = 1;
    else if (direction === "right") times = 2;
    else if (direction === "down") times = 3;
    rotated = rotate(grid, times);

    const compressed = compress(rotated);
    const { newGrid: merged, gained } = merge(compressed);
    const final = compress(merged);

    const restored = rotate(final, (4 - times) % 4);

    if (JSON.stringify(restored) !== JSON.stringify(grid)) {
      setGrid(restored);
      setScore(prev => prev + gained);
      if (restored.some(row => row.includes(2048))) setWon(true);
      addRandomTile();
    }

    // Check for game over
    const hasMoves = () => {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (restored[r][c] === 0) return true;
          if (c < GRID_SIZE - 1 && restored[r][c] === restored[r][c + 1]) return true;
          if (r < GRID_SIZE - 1 && restored[r][c] === restored[r + 1][c]) return true;
        }
      }
      return false;
    };
    if (!hasMoves()) setGameOver(true);
  }, [grid, addRandomTile, gameOver]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp") move("up");
    else if (e.key === "ArrowDown") move("down");
    else if (e.key === "ArrowLeft") move("left");
    else if (e.key === "ArrowRight") move("right");
  }, [move]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2">
        {grid.flat().map((val, idx) => (
          <div
            key={idx}
            className={`w-16 h-16 flex items-center justify-center rounded-md text-2xl font-bold ${
              val === 0
                ? "bg-gray-200 text-gray-500"
                : val < 256
                ? "bg-yellow-200 text-yellow-800"
                : val < 512
                ? "bg-orange-200 text-orange-800"
                : val < 1024
                ? "bg-red-200 text-red-800"
                : "bg-purple-200 text-purple-800"
            }`}
          >
            {val !== 0 ? val : null}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => move("up")}>↑</Button>
        <Button onClick={() => move("left")}>←</Button>
        <Button onClick={() => move("right")}>→</Button>
        <Button onClick={() => move("down")}>↓</Button>
      </div>
      <div className="text-xl">Score: {score}</div>
      {gameOver && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-2xl font-bold">
            {won ? "You won!" : "Game Over"}
          </div>
          <Share text={`I scored ${score} in 2048! ${url}`} />
          <Button onClick={initGame}>Restart</Button>
        </div>
      )}
    </div>
  );
}
