import React, { useEffect, useRef } from 'react';

function PointBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Size of each point pixel and the gap between them
        const pointSize = 2; 
        const resolution = 6; // Spacing scale (Lower = denser grid, Higher = faster performance)

        let animationFrameId;
        let cols, rows;
        let grid = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            cols = Math.ceil(canvas.width / resolution);
            rows = Math.ceil(canvas.height / resolution);

            // Start completely blank
            grid = Array(rows).fill().map(() => Array(cols).fill(0));
        };

        // Standard 8-Neighbor Moore Grid Check (Ultra efficient)
        const countNeighbors = (grid, x, y) => {
            let sum = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    // Skip checking the center cell itself
                    if (i === 0 && j === 0) continue;

                    const col = x + i;
                    const row = y + j;

                    // Boundary edge check
                    if (col >= 0 && col < cols && row >= 0 && row < rows) {
                        sum += grid[row][col];
                    }
                }
            }
            return sum;
        };

        const updateGrid = () => {
            let nextGrid = Array(rows).fill().map(() => Array(cols).fill(0));

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const neighbors = countNeighbors(grid, x, y);
                    const isAlive = grid[y][x] === 1;

                    // Standard Conway's Game of Life Rules
                    if (isAlive && (neighbors === 2 || neighbors === 3)) {
                        nextGrid[y][x] = 1; // Survival
                    } else if (!isAlive && neighbors === 3) {
                        nextGrid[y][x] = 1; // Birth
                    }
                }
            }
            grid = nextGrid;
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Neon matrix green
            ctx.fillStyle = '#2f2f2f'; 

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (grid[y][x] === 1) {
                        // Map 2D array coordinates straight to screen pixels
                        ctx.fillRect(x * resolution, y * resolution, pointSize, pointSize);
                    }
                }
            }
        };

        const handleMouseMove = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Map mouse straight to the closest grid array index
            const gridX = Math.floor(mouseX / resolution);
            const gridY = Math.floor(mouseY / resolution);

            // Spawn a tight cluster of dots around the mouse pointer
            const brushSize = 2;
            for (let i = -brushSize; i <= brushSize; i++) {
                for (let j = -brushSize; j <= brushSize; j++) {
                    const targetX = gridX + i;
                    const targetY = gridY + j;

                    if (targetX >= 0 && targetX < cols && targetY >= 0 && targetY < rows) {
                        // Randomize slightly so it builds organic shapes instead of solid squares
                        if (Math.random() > 0.3) {
                            grid[targetY][targetX] = 1;
                        }
                    }
                }
            }
        };

        let lastUpdate = 0;
        const tick = (timestamp) => {
            if (!lastUpdate) lastUpdate = timestamp;
            const elapsed = timestamp - lastUpdate;

            // Compute physics steps every 80ms (snappy and lightweight)
            if (elapsed > 80) {
                updateGrid();
                lastUpdate = timestamp;
            }
            
            render();
            animationFrameId = requestAnimationFrame(tick);
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        
        resizeCanvas();
        animationFrameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none', 
                backgroundColor: '#1f1f1f'
            }}
        />
    );
}

export default PointBackground;