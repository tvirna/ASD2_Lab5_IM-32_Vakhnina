'use strict';

const vector = (x1, y1, x2, y2) => {
    const x = x2 - x1,
        y = y2 - y1;
    return {
        x: x,
        y: y
    }
}

const vectorModule = (vector) => {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

const pseudoRandom = (seed) => {
    let value = seed;

    return function() {
        value = (value * 1103515245 + 12345) % 2147483648;
        return value % 100 < 19;
    }
}

const findVertexCoord = (vertexCount, firstCoordX, firstCoordy) => {
    let Coords = {
        xCoord: [],
        yCoord: []
    }

    Coords.xCoord[0] = firstCoordX;
    Coords.yCoord[0] = firstCoordy;
    for (let i = 1; i < vertexCount; i++){
        switch (i) {
            case 1:
            case 2:
            case 3: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] + 60;
                Coords.yCoord[i] = Coords.yCoord[i - 1] + 100;
                break;
            }
            case 4:
            case 5:
            case 6:
            case 7: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] - 90;
                Coords.yCoord[i] = Coords.yCoord[i - 1];
                break;
            }
            case 8:
            case 9: {
                Coords.xCoord[i] = Coords.xCoord[i - 1] + 60;
                Coords.yCoord[i] = Coords.yCoord[i - 1] - 100;
                break;
            }
            default: {
                break;
            }
        }
    }
    return Coords;
}

const createDirMatrix = (n) => {
    const n1 = Math.floor(n / 1000),
        n2 = Math.floor((n - n1 * 1000) / 100),
        n3 = Math.floor((n - n1 * 1000 - n2 * 100) / 10),
        n4 = Math.floor((n - n1 * 1000 - n2 * 100 - n3 * 10))
    const variant = [n1, n2, n3, n4];
    const count = 10 + variant[2];
    const generator = pseudoRandom(n);
    let matrix = new Array(count);
    for (let i = 0; i < count; i++) {
        matrix[i] = new Array(count);
    }
    const k = 1.0 - variant[2] * 0.01 - variant[3] * 0.005 - 0.15;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            matrix[i][j] = Math.floor(generator() * 2 * k);
        }
    }
    return matrix;
}

const calculateAngle = (Coords, i, j) => {
    const startX = Coords.xCoord[i];
    const startY = Coords.yCoord[i];
    const endX = Coords.xCoord[j];
    const endY = Coords.yCoord[j];
    return Math.atan2(endY - startY, endX - startX);
}

const lineVal = (Coords, i, j, radius) => {
    const startX = Coords.xCoord[i];
    const startY = Coords.yCoord[i];
    const endX = Coords.xCoord[j];
    const endY = Coords.yCoord[j];
    const vector1 = vector(startX, startY, endX, endY);
    const a = vectorModule(vector1);
    let valResult = null;
    for (let k = 0; k < Coords.xCoord.length; k++){
        if(k === i || k === j) continue;
        if(Math.abs(j - i) === 1) break;
        const vector2 = vector(startX, startY, Coords.xCoord[k], Coords.yCoord[k]);
        const vector3 = vector(Coords.xCoord[k], Coords.yCoord[k], endX, endY);
        const b = vectorModule(vector2);
        const c = vectorModule(vector3);
        const p = (a + b + c) / 2;
        const height = Math.sqrt(p * (p - a) * (p - b) * (p - c)) * 2 / a;
        if (height < radius) {
            valResult = a;
            break;
        }
    }
    return valResult;
}

const createClickQueue = () => {
    const queue = []; // Черга функцій для виконання

    const enqueue = (action) => {
        queue.push(action);
    };

    const next = () => {
        if (queue.length > 0) {
            const action = queue.shift(); // Беремо першу дію з черги
            action(); // Виконуємо дію
        }
    };

    return { enqueue, next };
}

const printText = (ctx, text, Coords) => {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(text, Coords.xCoord[0], Coords.yCoord[0] - 50);
}

export {vector, vectorModule, pseudoRandom, findVertexCoord, createDirMatrix, calculateAngle, lineVal,
    createClickQueue, printText};