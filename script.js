document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cube = document.getElementById('cube');
    const scrambleBtn = document.getElementById('scramble-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timerElement = document.getElementById('timer');
    const moveCountElement = document.getElementById('move-count');

    // State Variables
    let cubies = [];
    let isDragging = false, isAnimating = false;
    let startX, startY;
    let currentX = -30, currentY = -45;
    let moveCount = 0;
    let timerInterval;
    let time = 0;
    let isSolved = true;
    let moveQueue = [];

    // Constants
    const CUBIE_SIZE = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cubie-size'));
    const MOVES = {
        'U': { axis: 'y', slice: -1, dir: 1 }, 'U\'': { axis: 'y', slice: -1, dir: -1 },
        'D': { axis: 'y', slice: 1, dir: -1 }, 'D\'': { axis: 'y', slice: 1, dir: 1 },
        'L': { axis: 'x', slice: -1, dir: -1 }, 'L\'': { axis: 'x', slice: -1, dir: 1 },
        'R': { axis: 'x', slice: 1, dir: 1 }, 'R\'': { axis: 'x', slice: 1, dir: -1 },
        'F': { axis: 'z', slice: 1, dir: 1 }, 'F\'': { axis: 'z', slice: 1, dir: -1 },
        'B': { axis: 'z', slice: -1, dir: -1 }, 'B\'': { axis: 'z', slice: -1, dir: 1 }
    };

    // --- Core Functions ---

    function createCubie(x, y, z) {
        const element = document.createElement('div');
        element.className = 'cubie';
        
        const faces = ['front', 'back', 'top', 'bottom', 'left', 'right'];
        faces.forEach(faceName => {
            const face = document.createElement('div');
            face.className = `face ${faceName}`;
            element.appendChild(face);
        });

        // Store initial transform and rotation
        element.style.transform = `translateX(${x * CUBIE_SIZE}px) translateY(${y * CUBIE_SIZE}px) translateZ(${z * CUBIE_SIZE}px)`;
        
        return { element, x, y, z, rotation: { x: 0, y: 0, z: 0 } };
    }

    function createCube() {
        cube.innerHTML = '';
        cubies = [];
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    // Skip the core piece
                    if (x === 0 && y === 0 && z === 0) continue;
                    const cubie = createCubie(x, y, z);
                    cubies.push(cubie);
                    cube.appendChild(cubie.element);
                }
            }
        }
        loadState(); // Load saved state after creation
    }

    function processMoveQueue() {
        if (isAnimating || moveQueue.length === 0) return;
        
        isAnimating = true;
        const move = moveQueue.shift();
        
        if (isSolved && moveQueue.length > 0) { // If it's a scramble
            // No timer start
        } else if (isSolved) {
            startTimer();
            isSolved = false;
        }

        const { axis, slice, dir } = MOVES[move];
        const sliceCubies = cubies.filter(c => c[axis] === slice);
        const rotation = dir * 90;

        // Apply rotation animation
        sliceCubies.forEach(cubie => {
            const currentRotation = cubie.element.style.transform.match(/rotate.*\)/g) || '';
            cubie.element.style.transition = 'transform 0.3s ease-in-out';
            cubie.element.style.transform = `rotate${axis.toUpperCase()}(${rotation}deg) ${currentRotation}`;
        });

        // After animation, update state
        setTimeout(() => {
            sliceCubies.forEach(cubie => {
                // Update logical position
                const { x, y, z } = cubie;
                const rad = dir * Math.PI / 2;
                if (axis === 'x') {
                    cubie.y = Math.round(y * Math.cos(rad) - z * Math.sin(rad));
                    cubie.z = Math.round(y * Math.sin(rad) + z * Math.cos(rad));
                } else if (axis === 'y') {
                    cubie.x = Math.round(x * Math.cos(rad) + z * Math.sin(rad));
                    cubie.z = Math.round(z * Math.cos(rad) - x * Math.sin(rad));
                } else { // 'z'
                    cubie.x = Math.round(x * Math.cos(rad) - y * Math.sin(rad));
                    cubie.y = Math.round(x * Math.sin(rad) + y * Math.cos(rad));
                }

                // Reset individual cubie rotation and apply final position
                cubie.element.style.transition = 'none';
                cubie.element.style.transform = `translateX(${cubie.x*CUBIE_SIZE}px) translateY(${cubie.y*CUBIE_SIZE}px) translateZ(${cubie.z*CUBIE_SIZE}px)`;
            });

            // If it's not a scramble, update move count
            if (!moveQueue.some(m => MOVES[m])) {
                moveCount++;
                moveCountElement.textContent = moveCount;
            }

            isAnimating = false;
            saveState();
            processMoveQueue(); // Process next move if any
        }, 300);
    }
    
    function addMove(move) {
        moveQueue.push(move);
        if (!isAnimating) {
            processMoveQueue();
        }
    }

    // --- UI and State Management ---

    function scramble() {
        reset();
        const moves = Object.keys(MOVES);
        let scrambleSequence = [];
        for (let i = 0; i < 20; i++) {
            scrambleSequence.push(moves[Math.floor(Math.random() * moves.length)]);
        }
        moveCount = 0; // Don't count scramble moves
        moveCountElement.textContent = '0';
        scrambleSequence.forEach(move => addMove(move));
    }
    
    function reset() {
        stopTimer();
        isSolved = true;
        moveCount = 0;
        moveCountElement.textContent = '0';
        resetTimer();
        moveQueue = [];
        createCube(); // This will recreate and call loadState for a clean reset
        saveState(); // Save the fresh state
    }

    function saveState() {
        const state = {
            cubies: cubies.map(c => ({ x: c.x, y: c.y, z: c.z })),
            rotation: { x: currentX, y: currentY },
            time,
            moves: moveCount,
            isSolved
        };
        localStorage.setItem('rubiksCubeState', JSON.stringify(state));
    }

    function loadState() {
        const state = JSON.parse(localStorage.getItem('rubiksCubeState'));
        if (state && state.cubies.length === cubies.length) {
            for(let i = 0; i < state.cubies.length; i++) {
                cubies[i].x = state.cubies[i].x;
                cubies[i].y = state.cubies[i].y;
                cubies[i].z = state.cubies[i].z;
                cubies[i].element.style.transform = `translateX(${cubies[i].x * CUBIE_SIZE}px) translateY(${cubies[i].y * CUBIE_SIZE}px) translateZ(${cubies[i].z * CUBIE_SIZE}px)`;
            }
            currentX = state.rotation.x;
            currentY = state.rotation.y;
            cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            
            moveCount = state.moves;
            moveCountElement.textContent = moveCount;
            time = state.time;
            timerElement.textContent = formatTime(time);
            isSolved = state.isSolved;
            if (!isSolved) startTimer();
        }
    }
    
    // --- Timer Functions ---
    
    function startTimer() {
        clearInterval(timerInterval);
        const startTime = Date.now() - time;
        timerInterval = setInterval(() => {
            time = Date.now() - startTime;
            timerElement.textContent = formatTime(time);
        }, 100);
    }
    function stopTimer() { clearInterval(timerInterval); }
    function resetTimer() { stopTimer(); time = 0; timerElement.textContent = '00:00.0'; }
    function formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const tenths = Math.floor((ms % 1000) / 100);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
    }

    // --- Event Listeners ---
    
    // Mouse drag for cube rotation
    cube.parentElement.addEventListener('mousedown', e => {
        if (isAnimating) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        cube.style.transition = 'none';
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        currentY += dx * 0.5;
        currentX -= dy * 0.5;
        cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        startX = e.clientX;
        startY = e.clientY;
    });
    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            cube.style.transition = 'transform 0.2s linear';
            saveState();
        }
    });

    // Buttons
    document.querySelectorAll('.move-btn').forEach(button => {
        button.addEventListener('click', () => addMove(button.dataset.move));
    });
    scrambleBtn.addEventListener('click', scramble);
    resetBtn.addEventListener('click', reset);

    // Keyboard shortcuts
    window.addEventListener('keydown', e => {
        const key = e.key.toUpperCase();
        let move = null;
        if (Object.keys(MOVES).includes(key)) {
            move = e.shiftKey ? `${key}'` : key;
            // Handle cases where 'U' and 'U'' are separate buttons
            if (MOVES[move]) addMove(move);
            else if (e.shiftKey && MOVES[`${key.slice(0,1)}'`]) addMove(`${key.slice(0,1)}'`);
            else if (!e.shiftKey && MOVES[key]) addMove(key);
        }
    });

    // --- Initialisation ---
    createCube();
});
