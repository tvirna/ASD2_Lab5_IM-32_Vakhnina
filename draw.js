'use strict';

import {findVertexCoord, vector, vectorModule, createDirMatrix, lineVal, calculateAngle,
    createClickQueue, printText} from "./utility.js";
import {Queue, Stack} from "./structs.js";

const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");

const colors = ["red", "blue", "black", "green", "yellow",
    "brown", "#70295a", "orange", "#295b70", "#70294f"]

const drawOnlyVertex = (Coords, i,  ctx, radius, color) => {
    ctx.beginPath();
    ctx.arc(Coords.xCoord[i], Coords.yCoord[i], radius, 0, Math.PI * 2);
    ctx.strokeStyle = colors[color];
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText((i + 1).toString(), Coords.xCoord[i], Coords.yCoord[i]);
    ctx.closePath();
}

const drawStatus = (Coords, i,  ctx, radius, color, status) => {
    ctx.beginPath();
    ctx.arc(Coords.xCoord[i] + radius, Coords.yCoord[i] - radius, radius / 3, 0, Math.PI * 2);
    ctx.strokeStyle = colors[color];
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.fillText(status, Coords.xCoord[i] + radius, Coords.yCoord[i] - radius);
    ctx.closePath();
}

const drawVertexes = (ctx, count, x, y, radius, status = '') => {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
        const Coords = findVertexCoord(count, x, y);
        status !== '' ? drawStatus(Coords, i, ctx, radius, "black", "н") :
            drawOnlyVertex(Coords, i, ctx, radius);
    }
}

const drawStitch = (Coords, i, ctx, radius, color) => {
    ctx.beginPath();
    ctx.moveTo(Coords.xCoord[i], Coords.yCoord[i]);
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = colors[color];
    ctx.arc(Coords.xCoord[i] - radius, Coords.yCoord[i] - radius,
        radius, 0, Math.PI / 2, true);
    ctx.stroke();
    ctx.closePath();
}

const drawLine = (Coords, i, j, ctx, radius, angle, color) => {
    const xStart = Coords.xCoord[i] + radius * Math.cos(angle);
    const yStart = Coords.yCoord[i] + radius * Math.sin(angle);
    const xEnd = Coords.xCoord[j] - radius * Math.cos(angle);
    const yEnd = Coords.yCoord[j] - radius * Math.sin(angle);
    ctx.beginPath();
    ctx.strokeStyle = colors[color];
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
    ctx.closePath();
}

const drawEllipse = (Coords, i, j, angle, ctx, radius, color) => {
    const startX = Coords.xCoord[i] + radius * Math.cos(angle);
    const startY = Coords.yCoord[i] + radius * Math.sin(angle);
    const endX = Coords.xCoord[j] - radius * Math.cos(angle);
    const endY = Coords.yCoord[j] - radius * Math.sin(angle);
    const middleX = (startX + endX) / 2;
    const middleY = (startY + endY) / 2;
    const newAngle = Math.atan2((endY - startY), (endX - startX));
    const triangleRadius = vectorModule(vector(startX, startY, endX, endY))
    ctx.beginPath();
    ctx.strokeStyle = colors[color];
    ctx.moveTo(startX, startY);
    ctx.ellipse(middleX, middleY, triangleRadius / 2, radius * 2,
        newAngle, Math.PI, 0);
    ctx.stroke();
    ctx.closePath();
    return newAngle;
}

const drawArrows = (angle, xArrow, yArrow, ctx, color, n = 0) => {
    let leftX,
        rightX,
        leftY,
        rightY;
    if (n === 1){
        leftX = xArrow - 15 * Math.cos(angle + 0.5 + Math.PI / 3);
        rightX = xArrow - 15 * Math.cos(angle - 0.5 + Math.PI / 3);
        leftY = yArrow - 15 * Math.sin(angle + 0.5 + Math.PI / 3);
        rightY = yArrow - 15 * Math.sin(angle - 0.5 + Math.PI / 3);
    }
    else {
        leftX = xArrow - 15 * Math.cos(angle + 0.5);
        rightX = xArrow - 15 * Math.cos(angle - 0.5);
        leftY = yArrow - 15 * Math.sin(angle + 0.5);
        rightY = yArrow - 15 * Math.sin(angle - 0.5);
    }
    ctx.beginPath();
    ctx.strokeStyle = colors[color];
    ctx.moveTo(xArrow, yArrow);
    ctx.lineTo(leftX, leftY);
    ctx.moveTo(xArrow, yArrow);
    ctx.lineTo(rightX, rightY);
    ctx.stroke();
    ctx.closePath();
}

const arrow = (Coords, j, angle, vertexRadius, ctx, color, n) => {
    const xArrow = Coords.xCoord[j] - vertexRadius * Math.cos(angle);
    const yArrow = Coords.yCoord[j] - vertexRadius * Math.sin(angle);
    drawArrows(angle, xArrow, yArrow, ctx, color, n);
}

const clickQueue1 = createClickQueue();
const clickQueue2 = createClickQueue();

const drawDirGraph = (x, y, n, ctx, radius, count) => {
    const matrix = createDirMatrix(n);
    const Coords = findVertexCoord(count, x, y);
    drawVertexes(ctx, count, x, y, radius);
    printText(ctx, "Напрямлений граф", Coords);
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            if (matrix[i][j] === 1) {
                const angle = calculateAngle(Coords, i, j);
                const val = lineVal(Coords, i, j, radius);
                if (i === j) {
                    drawStitch(Coords, i, ctx, radius, 2);
                    arrow(Coords, j, angle, radius, ctx, 2);
                }
                else if (matrix[j][i] === 1 && i > j || val !== null){
                    const valid = 1;
                    drawEllipse(Coords, i, j, angle, ctx, radius, 2);
                    arrow(Coords, j, angle, radius, ctx, 2, valid);
                }
                else {
                    drawLine(Coords, i, j, ctx, radius, angle, 2);
                    arrow(Coords, j, angle, radius, ctx, 2);
                }
            }
        }
    }
    console.group("Матриця суміжності графу");
    console.table(matrix);
    console.groupEnd();
}

const BFS = (x, y, count, matrix, a, ctx, radius) => {
    const Coords = findVertexCoord(count, x, y);
    const bfsMatrix = new Array(matrix.length).fill(0);

    bfsMatrix.forEach((value, index) => {
        bfsMatrix[index] = new Array(matrix.length).fill(0);
    });

    printText(ctx, "Обхід BFS метод", Coords);
    drawVertexes(ctx, count, x, y, radius);
    drawVertexes(ctx, count, x, y, radius,  'н');
    const q = new Queue();
    const bfs = new Array(matrix.length).fill(0);
    let pointer = 0;
    bfs[a] = 1;
    let k = 1;
    q.enqueue(a);
    while (!q.isEmpty()){
        const v = q.dequeue();
        for (let u = 0; u < matrix.length; u++){
            if (matrix[v][u] === 1 && bfs[u] === 0){
                k++;
                bfsMatrix[v][u] = 1;
                bfs[u] = k;
                q.enqueue(u);
                drawEdge(Coords, v, u, ctx, radius, pointer, matrix, clickQueue1);
            }
        }
        clickQueue1.enqueue(() => {
            drawStatus(Coords, v, ctx, radius, pointer, 'з');
        })
        pointer++;
    }
    console.group("Список відповідності номерів вершин і їх нової нумерації та матриця суміжності дерева BFS обходу");
    bfs.map((value, index) => {
        console.log(`Індекс вершини: ${index + 1}, номер вершини по обходу: ${value}`)
    });
    console.table(bfsMatrix);
    console.groupEnd();
    button1.addEventListener("click", clickQueue1.next);
}

const drawEdge = (Coords, v, u, ctx, radius, pointer, matrix, clickQueue) => {
    const angle = calculateAngle(Coords, v, u);
    clickQueue.enqueue(() => {
        drawOnlyVertex(Coords, v, ctx, radius, pointer);
        drawStatus(Coords, v, ctx, radius, pointer, 'a');
    })
    const val = lineVal(Coords, v, u, radius);
    if (val !== null){
        const valid = 1;
        clickQueue.enqueue(() => {
            drawOnlyVertex(Coords, v, ctx, radius, pointer);
            drawEllipse(Coords, v, u, angle, ctx, radius, pointer);
            drawOnlyVertex(Coords, u, ctx, radius, pointer);
            drawStatus(Coords, u, ctx, radius, pointer, 'в');
            arrow(Coords, u, angle, radius, ctx, pointer, valid);
        })
    }
    else {
        clickQueue.enqueue(() => {
            drawOnlyVertex(Coords, v, ctx, radius, pointer);
            drawLine(Coords, v, u, ctx, radius, angle, pointer);
            drawOnlyVertex(Coords, u, ctx, radius, pointer);
            drawStatus(Coords, u, ctx, radius, pointer, 'в');
            arrow(Coords, u, angle, radius, ctx, pointer);
        })
    }
}

const DFS = (x, y, count, matrix, a, ctx, radius) => {
    const Coords = findVertexCoord(count, x, y);
    printText(ctx, "Обхід DFS метод", Coords);
    drawVertexes(ctx, count, x, y, radius);
    const dfsMatrix = new Array(matrix.length).fill(0);
    dfsMatrix.forEach((value, index) => {
        dfsMatrix[index] = new Array(matrix.length).fill(0);
    });
    let pointer = 0;
    const s = new Stack();
    const dfs = new Array(matrix.length).fill(0);
    drawVertexes(ctx, count, x, y, radius,  'н');
    let k = 1;
    dfs[a] = 1;
    s.push(a);
    while (!s.isEmpty()){
        const v = s.first();
        for (let u = 0; u < matrix.length; u++){
            if (matrix[v][u] === 1 && dfs[u] === 0){
                dfsMatrix[v][u] = 1;
                k++;
                dfs[u] = k;
                s.push(u);
                drawEdge(Coords, v, u, ctx, radius, v, matrix, clickQueue2);
                break;
            }
            else if (u === matrix.length - 1) s.pop();
        }
        clickQueue2.enqueue(() => {
            drawStatus(Coords, v, ctx, radius, pointer, 'з');
        })
        pointer++;
    }
    console.group("Список відповідності номерів вершин і їх нової нумерації та матриця суміжності дерева DFS обходу");
    dfs.map((value, index) => {
        console.log(`Індекс вершини: ${index + 1}, номер вершини по обходу: ${value}`);
    })
    console.table(dfsMatrix);
    console.groupEnd();
    button2.addEventListener("click", clickQueue2.next);
}

export {drawVertexes, drawOnlyVertex, vectorModule, vector, arrow,
    drawStitch, drawLine, drawEllipse, drawArrows, findVertexCoord, drawDirGraph, BFS, DFS}