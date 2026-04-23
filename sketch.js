let targetRotateLeft = 180; 
let targetRotateRight = -180; 
let rotateLeft = 0; // declare a variable to store the rotation of the left page
let rotateRight = 0; // declare a variable to store the rotation of the right page
let gridVertices = []; // declare an array to store the vertices of the grid squares
let totalRows = 0; // declare a variable to track how many rows the grid has 
let mapBlocks = []; // store randomly generated blocks 
let blockPositions = []; //store those blocks position 
let gutterIntersections = [] //store the position of every gutter 
let pattern1Positions = []; //store the randomly chosen spots of pattern 1 
let squareSize = 0; 
let gutter = 8;
const gridCols = 24;
let pattern3Positions = []; //store the randomly chosen spots of pattern 3
let myFontNormal; 
let myFontBold; 
let myArrowLeft; 
let myArrowRight; 
let mathTable; // store the parsed CSV data
let isMenuOpen = false; 
let selectedCountryIndex = 0; 
let countryList = []; 
let selectedQuarters = [];
let activePaths = []; // Store the generated paths
let backgroundPaths = []; // Store the new background random paths
let pathRevealProgress = 1;
let sliderPct = 0; // The slider progress (0 to 1)
let isDraggingSlider = false;
// Biến lưu điểm bắt đầu và đích chung
let commonStartNode = {r: 0, c: 0};
let commonEndNode = {r: 0, c: 0};

let gridLeft, gridRight, gridTop, gridBottom; // define the limit of the middlePage 

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);
    
    mapBaseGrid(); 
    generateMapBlocks();
    generateBackgroundPaths();

    if (mathTable) {
        for (let i = 0; i < mathTable.getRowCount(); i++) {
            countryList.push(mathTable.getString(i,"country")); 
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    mapBaseGrid();
    generateMapBlocks();
}

function preload() {
  myFontNormal = loadFont('font/SpaceGrotesk-Regular.ttf');
  myFontBold = loadFont('font/SpaceGrotesk-Bold.ttf');
  myArrowLeft = loadImage('assets/arrow-left.png');
  myArrowRight = loadImage('assets/arrow-right.png'); 
  mathTable = loadTable('assets/math.csv', 'csv', 'header'); 
  mySound = loadSound("assets/04_Master.wav");
}

function draw() {
    rotateLeft = lerp(rotateLeft, targetRotateLeft, 0.1); 
    rotateRight = lerp(rotateRight, targetRotateRight, 0.1); 

    background(240);

    drawMiddlePage(); // draw the middle page first

    push();
    translate(-width / 2, -height / 2); // move the origin to the top-left corner
    pop();


    drawMapBlocks(); 
    drawPattern3s(); 
    drawPatterns(); 

    drawBackgroundPaths(); 
      drawSelectedQuarterPoints();

    drawOutLeftPageBack(); // draw the back of the left page
    drawOutRightPageBack(); // draw the back of the right page
    drawOutLeftPageFront(); // draw the front of the left page
    drawOutRightPageFront(); // draw the front of the right page
    
    // drawGuideGrid(12, 12, 64, 16); // draw the guide grid



    push(); 
   translate(-width/2 + 64 + 30, height / 2 - 48, 5); 
    textAlign(RIGHT, CENTER); // Text extends outwards towards the left bounds
    textFont(myFontNormal);
    textSize(12);
    fill(0);
    noStroke();
    text('SDG 10', 0, 0);
    pop(); 

    push(); 
   translate(width / 2 - 60, height / 2 - 48, 5); 
    textAlign(RIGHT, CENTER); // Text extends outwards towards the left bounds
    textFont(myFontNormal);
    textSize(12);
    fill(0);
    noStroke();
    text('Reduce Inequality', 0, 0);
    pop(); 
}
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.button-menu');
    const overlay = document.getElementById('aboutOverlay');
    const accordions = document.querySelectorAll('.accordion');

    // 1. Xử lý đóng mở Overlay
    menuBtn.addEventListener('click', function() {
        // Toggle class cho nút menu (biến thành X)
        this.classList.toggle('open');
        // Toggle class cho overlay (trượt xuống)
        overlay.classList.toggle('about--open');
    });

    // 2. Xử lý đóng mở Accordion (Phần 01, 02 trong About)
    accordions.forEach(function(item) {
        const header = item.querySelector('.accordion__header');
        header.addEventListener('click', function() {
            const isOpen = item.classList.contains('accordion--open');
            
            // Đóng tất cả các cái khác
            accordions.forEach(a => a.classList.remove('accordion--open'));
            
            // Nếu cái đang bấm chưa mở thì mở nó ra
            if (!isOpen) {
                item.classList.add('accordion--open');
            }
        });
    });
});
function drawGuideGrid(cols, rows, margin, gutterSize) { 
    const gridW = width - margin * 2;
    const gridH = height - margin * 2;
    if (gridW <= 0 || gridH <= 0) return;
    const cellW = (gridW - gutterSize * (cols - 1)) / cols;
    const cellH = (gridH - gutterSize * (rows - 1)) / rows;
    if (cellW <= 0 || cellH <= 0) return;
    push();
    translate(-width / 2, -height / 2, 10);
    noFill();
    stroke(255, 0, 0, 26);
    strokeWeight(1);
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            rect(margin + c * (cellW + gutterSize), margin + r * (cellH + gutterSize), cellW, cellH);
    pop();
}
function drawOutLeftPageFront() {
    let pageWidth = width / 4 - 36;
    let pageHeight = height - 128 - 3;
    let hingeX = -width / 4 + 28 + 1; 
    let hingeY = (-height / 2) + 64 + 2; 

    push();
    translate(hingeX, hingeY,5); 
    rotateY(rotateLeft); 

    fill(255); stroke(0); strokeWeight(1);
    rect(-pageWidth, 0, pageWidth, pageHeight);

    // Dropdown Menu
    push(); 
    translate(-pageWidth + 20, 64, 1); 
    fill(0); rect(0, 0, 120, 40); 
    fill(255); textFont(myFontNormal); textSize(14); textAlign(CENTER, CENTER);
    text(countryList[selectedCountryIndex] || "Select Country", 60, 20);

    if (isMenuOpen) {
        for (let i = 0; i < countryList.length; i++){
            let itemY = 40 + (i * 30); 
            fill(245); rect(0, itemY, 120, 30);
            fill(0); text(countryList[i], 60, itemY + 15); 
        }
    }
    pop(); 
    pop();
}

function drawOutLeftPageBack() {
    let pageWidth = width / 4 - 36; 
    let pageHeight = height - 128 - 3; 
    let hingeX = -width / 4 + 28 + 1; 
    let hingeY = (-height / 2) + 64 + 2; 

    push();
    translate(hingeX, hingeY, 5); 
    rotateY(rotateLeft); 
    
    fill(255); stroke(0);
    rect(0, 0, -pageWidth, pageHeight);

    push();
    translate(-40, 145, -0.5); rotateY(180); 
    fill(0); noStroke(); textSize(50); textFont(myFontBold); 
    
    pop();

    push(); 
    translate(-40, 245, -0.5); rotateY(180); 
    fill(0); textSize(16); textFont(myFontNormal); 
   
    pop(); 

    pop();
}

function drawOutRightPageFront() {
    let pageWidth = width / 4 - 36; 
    let pageHeight = height - 128-3; 
    let hingeX = width / 4 - 32 + 4-1; 
    let hingeY = (-height / 2) + 64 +2; 

    push();
    translate(hingeX, hingeY, 5); 
    rotateY(rotateRight);

    push(); 
    translate(0, 0, 0.3); 
    beginShape();
    fill(255);
    stroke(0);
    strokeWeight(1);
    vertex(0, 0, 0);
    vertex(pageWidth, 0, 0);
    vertex(pageWidth, pageHeight, 0);
    vertex(0, pageHeight);
    endShape(CLOSE);
    pop(); 

    push();
    translate(hingeX - 4, 0.5,0.5);
    fill(0);
    noStroke();
    rect(-8, -4, 8, 8);
    rect(-8, pageHeight - 4, 8, 8);
    pop();

    // ==========================================

    // ==========================================
    // RIGHT PAGE MESSAGE & SLIDER UI
    // ==========================================
    if (mathTable && mathTable.getRowCount() > 0) {
        let changeVal = mathTable.getNum(selectedCountryIndex, "change_10th_percentile_score_per_unit_index");
        
        push();
        let boxWidth = pageWidth - 160; // <--- CHANGED WIDTH
        let boxHeight = 150; 
        let boxX = 100; // <--- CENTERED (16 left + 16 right = 32)
        let boxY = boxHeight - boxHeight/2 -50;

        translate(boxX, boxY, 0.7); 
        

        // 3. Draw Slider Track
        let trackMin = 15;
        let trackMax = boxWidth - 15;
        let trackY = 115;
        
      

        
        // 4. Draw Active Slider Fill & Thumb
        let currentX = map(sliderPct, 0, 1, trackMin, trackMax);
        stroke(255);
        line(trackMin, trackY, currentX, trackY);
        
        noStroke();
        fill(255);
        ellipse(currentX, trackY, 12, 12);
        pop();
    }
    pop();
}

function drawOutRightPageBack() {
    let pageWidth = width / 4 - 36; 
    let pageHeight = height - 128-3; 
    let hingeX = width / 4 - 32 + 4-1; 
    let hingeY = (-height / 2) + 64+2; 

    push();
    translate(hingeX, hingeY, 5); 
    rotateY(rotateRight);

    push(); 
    translate(0, 0, -0.3); 
    beginShape();
    fill(255);
    stroke(0);
    strokeWeight(1);
    vertex(0, 0, 0);
    vertex(pageWidth, 0, 0);
    vertex(pageWidth, pageHeight, 0);
    vertex(0, pageHeight);
    endShape(CLOSE);
    pop();


   



    pop(); 
}

function drawMiddlePage() {
    let pageWidth = (width / 4 - 32) * 2 + 8; // the page width
    let pageHeight = height - 128; // the page height

    push();
    translate(-width / 4 + 32 - 4, (-height / 2) + 64);
    beginShape();
    fill(254);
    stroke(0);
    vertex(0, 0, 0);
    vertex(pageWidth, 0, 0);
    vertex(pageWidth, pageHeight, 0);
    vertex(0, pageHeight, 0);
    endShape(CLOSE);
    pop();
}

function mapBaseGrid() { 
    gridVertices = []; 
    let pageWidth = floor(((width / 4 - 32) * 2 + 8)); 
    let pageHeight = floor(height - 128); 
    
    let margin = 8; 
    let gutter = 8;

    let gridWidth = pageWidth - (margin * 2); 
    let gridHeight = pageHeight - ((margin+16) * 2); 

    let squareNumHorizontal = gridCols; 

    squareSize = (gridWidth - (gutter * (squareNumHorizontal - 1))) / squareNumHorizontal; 
    if (squareSize <= 0 || !isFinite(squareSize)) {
        totalRows = 0;
        gutterIntersections = [];
        return;
    }

    let squareNumVertical = ceil((gridHeight + gutter) / (squareSize + gutter)); 
    totalRows = squareNumVertical; 

    let startX = -width / 4 + 32 - 4 + margin; 
    let startY = -height / 2 + 64 + margin + 16;    

    gridLeft = startX;
    gridRight = startX + gridWidth;
    gridTop = startY;
    gridBottom = startY + gridHeight;

    gutterIntersections = []; 

    for (let r = 0; r < totalRows - 1; r++) { 
        gutterIntersections[r] = [];
        for (let c = 0; c < squareNumHorizontal - 1; c++) { 
            let gx = startX + (c + 1) * squareSize + c * gutter + gutter / 2; 
            let gy = startY + (r + 1) * squareSize + r * gutter + gutter / 2;
            gutterIntersections[r][c] = createVector(gx, gy, 0);
        }
    } 

    for (let i = 0; i < squareNumVertical; i++) { 
        let yOffset = i * (squareSize + gutter); 
        let currentHeight = min(squareSize, gridHeight - yOffset);  
        if (currentHeight <= 0) break; 
        
        for (let j = 0; j < squareNumHorizontal; j++) { 
            let xOffset = j * (squareSize + gutter); 
            let x = startX + xOffset; 
            let y = startY + yOffset; 

            let v1 = createVector(x, y, 0); 
            let v2 = createVector(x + squareSize, y, 0);
            let v3 = createVector(x + squareSize, y + currentHeight, 0); 
            let v4 = createVector(x, y + currentHeight, 0); 

            gridVertices.push([v1, v2, v3, v4]); 
        }
    }
}

function drawStoredGrid() { 
    noFill();
    stroke(0);
    strokeWeight(1);
    for (let i = 0; i < gridVertices.length; i++) {
        let cell = gridVertices[i]; 
        beginShape();
        vertex(cell[0].x, cell[0].y, cell[0].z);
        vertex(cell[1].x, cell[1].y, cell[1].z);
        vertex(cell[2].x, cell[2].y, cell[2].z);
        vertex(cell[3].x, cell[3].y, cell[3].z);
        endShape(CLOSE);
    }
}

function generateMapBlocks() {
    mapBlocks = []; 
    blockPositions = []; 
    if (totalRows <= 0 || gridVertices.length === 0) {
        pattern1Positions = [];
        return;
    }
    let numBlocks = 500; 
    let maxAttempts = numBlocks * 6; 
    let attempts = 0;
    let blocksCreated = 0;

    let occupied = [];
    for (let r = 0; r < totalRows; r++) {
        occupied[r] = [];
        for (let c = 0; c < gridCols; c++) {
            occupied[r][c] = false;
        }
    }

    while (blocksCreated < numBlocks && attempts < maxAttempts) {
        attempts++;
        
        let w = floor(random(1, 4)); 
        let h = floor(random(1, 3)); 
        let col = floor(random(0, gridCols - w + 1)); 
        let row = floor(random(0, totalRows - h + 1));
        
        let canPlace = true; 
        for (let r = row; r < row + h; r++) {
            for (let c = col; c < col + w; c++) {
                if (occupied[r][c] === true) {
                    canPlace = false; 
                    break;            
                }
            }
            if (!canPlace) break; 
        }

        if (canPlace) {
            for (let r = row; r < row + h; r++) {
                for (let c = col; c < col + w; c++) {
                    occupied[r][c] = true;
                }
            }

            let innerDetails = generateSmallerBlocks(); 
            let pixelW = (w * squareSize) + ((w - 1) * gutter);
            let pixelH = (h * squareSize) + ((h - 1) * gutter);
            let p2Blocks = generatePattern2Blocks(pixelW, pixelH);

            mapBlocks.push({ 
                col: col, 
                row: row, 
                w: w, 
                h: h, 
                details: innerDetails, 
                pattern2Blocks: p2Blocks 
            }); 
            blocksCreated++; 
        }
    }
    generatePatterns(); 
    generatePattern3(); 
}

function drawMapBlocks() { 
    for (let i = 0; i < mapBlocks.length; i++) {
        let b = mapBlocks[i]; 

        let topLeftIndex = (b.row * gridCols) + b.col; 
        let topRightIndex = (b.row * gridCols) + (b.col + b.w - 1);
        let bottomRightIndex = ((b.row + b.h - 1) * gridCols) + (b.col + b.w - 1); 
        let bottomLeftIndex = ((b.row + b.h - 1) * gridCols) + b.col; 

        if (!gridVertices[topLeftIndex] || !gridVertices[topRightIndex] || !gridVertices[bottomRightIndex] || !gridVertices[bottomLeftIndex]) {
            continue;
        }

        let v1 = gridVertices[topLeftIndex][0]; 
        let v2 = gridVertices[topRightIndex][1]; 
        let v3 = gridVertices[bottomRightIndex][2]; 
        let v4 = gridVertices[bottomLeftIndex][3]; 

        push(); 
        fill(250); 
        stroke(150); 
        strokeWeight(0.1);

        beginShape(); 
        vertex(v1.x, v1.y, v1.z); 
        vertex(v2.x, v2.y, v2.z); 
        vertex(v3.x, v3.y, v3.z); 
        vertex(v4.x, v4.y, v4.z); 
        endShape(CLOSE); 
        
        pop(); 
        drawSmallerBlocks(b, v1, v2, v4); 
        drawPattern2Blocks(b, v1); 
    }
}

function keyPressed() {
    generateMapBlocks();
    generateBackgroundPaths(); // Reseeds the background lines
    generateQuarterPaths();    // Reseeds the quarter data lines
}

function generateSmallerBlocks() {
    let innerRectangles = [];
    let targetDetails = floor(random(3, 12)); 
    let maxAttempts = 150; 
    let attempts = 0;

    while (innerRectangles.length < targetDetails && attempts < maxAttempts) {
        attempts++;

        let wPct = random(0.05, 0.3); 
        let hPct = random(0.05, 0.3);
        let xPct = random(0, 1 - wPct); 
        let yPct = random(0, 1 - hPct);

        let isOverlapping = false;
        let pad = 0.02; 

        for (let i = 0; i < innerRectangles.length; i++) {
            let existing = innerRectangles[i];

            if (
                xPct < existing.x + existing.w + pad && 
                xPct + wPct + pad > existing.x &&       
                yPct < existing.y + existing.h + pad && 
                yPct + hPct + pad > existing.y          
            ) {
                isOverlapping = true; 
                break; 
            }
        }

        if (!isOverlapping) {
            let shade = random(100, 200);
            innerRectangles.push({ x: xPct, y: yPct, w: wPct, h: hPct});
        }
    }
    
    return innerRectangles;
}

function drawSmallerBlocks(b, v1, v2, v4) {
    let blockPixelWidth = v2.x - v1.x;
    let blockPixelHeight = v4.y - v1.y;

    push();
    translate(v1.x, v1.y, v1.z + 1); 

    noStroke(); 
    for (let j = 0; j < b.details.length; j++) {
        let rectData = b.details[j];
        
        fill(245); 

        rect(
            rectData.x * blockPixelWidth, 
            rectData.y * blockPixelHeight, 
            rectData.w * blockPixelWidth, 
            rectData.h * blockPixelHeight
        );
    }
    pop(); 
}

function generatePatterns() {
    pattern1Positions = [];
    let numPatterns = 1; 
    let maxAttempts = 200; 
    let attempts = 0;

    if (totalRows < 5 || gutterIntersections.length === 0) {
        return;
    }

    let occupiedGutter = []; 
    for (let r = 0; r < totalRows; r++) {
        occupiedGutter[r] = [];
        for (let c = 0; c < gridCols; c++) {
            occupiedGutter[r][c] = false;
        }
    }

    while (pattern1Positions.length < numPatterns && attempts < maxAttempts) {
        attempts++;

        let minR = floor(totalRows / 2);
        let maxR = totalRows - 4;
        if (maxR <= minR) break;
        let r = floor(random(minR, maxR)); 

        let minC = floor(gridCols / 2);
        let maxC = min(gridCols - 4, gutterIntersections[0].length);
        if (maxC <= minC) break;
        let c = floor(random(minC, maxC)); 

        if (!occupiedGutter[r][c]) {
            for (let dr = -1; dr <= 1; dr++) { 
                for (let dc = -1; dc <= 1; dc++) {
                    if (r + dr >= 0 && r + dr < totalRows && c + dc >= 0 && c + dc < gridCols) {
                        occupiedGutter[r + dr][c + dc] = true;
                    }
                }
            }
            if (gutterIntersections[r] && gutterIntersections[r][c]) {
                pattern1Positions.push(gutterIntersections[r][c]);
            }
        }
    }
}

function drawPatterns() {
    for (let i = 0; i < pattern1Positions.length; i++) {
        let pos = pattern1Positions[i];

        push();
        translate(pos.x, pos.y, 2); 
        
        let s = 0.7 
        scale(s); 

        translate(-105, -150);

        let leftTip = (gridLeft - pos.x) / s + 105; 
        let rightTip = (gridRight - pos.x) / s + 105; 
        let topTip = (gridTop - pos.y) / s + 150; 
        let bottomTip = (gridBottom - pos.y) /s + 150; 

        drawPattern1(leftTip, rightTip, topTip, bottomTip); 
        pop();
    }
}

function drawPattern1(leftTip, rightTip, topTip, bottomTip) {
    fill(255);
    noStroke();

    // 1. Center Body
    beginShape();
    vertex(80, 100); vertex(130, 100); vertex(155, 125); vertex(155, 175);
    vertex(130, 200); vertex(80, 200); vertex(55, 175); vertex(55, 125);
    endShape(CLOSE);

    // 2. Top Wing Fill
    beginShape();
    vertex(80, 100);
    quadraticVertex(80, 70, 105 - 4, 70);
    vertex(105 - 4, topTip); vertex(105 + 4, topTip); vertex(105 + 4, 70);
    quadraticVertex(130, 70, 130, 100);
    endShape(CLOSE);

    // 3. Right Wing Fill
    beginShape();
    vertex(155, 125);
    quadraticVertex(185, 125, 185, 150 - 4);
    vertex(rightTip, 150 - 4); vertex(rightTip, 150 + 4); vertex(185, 150 + 4);
    quadraticVertex(185, 175, 155, 175);
    endShape(CLOSE);

    // 4. Bottom Wing Fill
    beginShape();
    vertex(130, 200);
    quadraticVertex(130, 230, 105 + 4, 230);
    vertex(105 + 4, bottomTip); vertex(105 - 4, bottomTip); vertex(105 - 4, 230);
    quadraticVertex(80, 230, 80, 200);
    endShape(CLOSE);

    // 5. Left Wing Fill
    beginShape();
    vertex(55, 175);
    quadraticVertex(25, 175, 25, 150 + 4);
    vertex(leftTip, 150 + 4); vertex(leftTip, 150 - 4); vertex(25, 150 - 4);
    quadraticVertex(25, 125, 55, 125);
    endShape(CLOSE);

    fill(255); 
    stroke(230);
    strokeWeight(1); 

    beginShape();
    // top wing
    vertex(80, 100);
    quadraticVertex(80, 70, 105 - 4-1, 70);
    vertex(105 - 4-2, topTip); 
    vertex(105 + 4-1, topTip); 
    vertex(105 + 4+1, 70);
    quadraticVertex(130, 70, 130, 100);
    // right wing
    vertex(155, 125);
    quadraticVertex(185, 125, 185, 150 - 4);
    vertex(rightTip, 150 - 4); 
    vertex(rightTip, 150 + 4); 
    vertex(185, 150 + 4);
    quadraticVertex(185, 175, 155, 175);
    //bottom wing
    vertex(130, 200);
    quadraticVertex(130, 230, 105 + 4, 230);
    vertex(105 + 4+1, bottomTip); 
    vertex(105 - 4-2, bottomTip); 
    vertex(105 - 4-2, 230);
    quadraticVertex(80, 230, 80, 200);
    //left wing
    vertex(55, 175);
    quadraticVertex(25, 175, 25, 150 + 4);
    vertex(leftTip, 150 + 4); 
    vertex(leftTip, 150 - 4); 
    vertex(25, 150 - 4);
    quadraticVertex(25, 125, 55, 125);
    endShape(CLOSE);

    push(); 
    stroke(255); 
    beginShape(); 
    vertex(105 - 4-2, topTip); 
    vertex(105 + 4-1, topTip); 
    endShape(CLOSE); 

    beginShape();
    vertex(rightTip, 150 - 4); 
    vertex(rightTip, 150 + 4); 
    endShape(CLOSE); 

    beginShape(); 
    vertex(105 + 4+1, bottomTip); 
    vertex(105 - 4-2, bottomTip); 
    endShape(CLOSE); 

    beginShape(); 
    vertex(leftTip, 150 + 4); 
    vertex(leftTip, 150 - 4); 
    endShape(CLOSE); 

    pop(); 

    fill(250);
    stroke(200);
    strokeWeight(0.3); 

    drawOctagon(105, 150, 45);

    beginShape(); 
    vertex(88, 100); 
    quadraticVertex(88, 78, 105, 78); 
    quadraticVertex(122, 78, 122, 102); 
    endShape(CLOSE);

    beginShape(); 
    vertex(157, 133); 
    quadraticVertex(177, 133, 177, 150); 
    quadraticVertex(177, 167, 155, 167); 
    endShape(CLOSE);

    beginShape(); 
    vertex(122, 202); 
    quadraticVertex(122, 222, 105, 222); 
    quadraticVertex(88, 222, 88, 200); 
    endShape(CLOSE);

    beginShape(); 
    vertex(55, 167); 
    quadraticVertex(33, 167, 33, 150); 
    quadraticVertex(33, 133, 57, 133);
    endShape(CLOSE);
}

function drawOctagon(cx, cy, r) {
    beginShape();
    for (let i = 0; i < 8; i++) {
        let angle = (360 / 8) * i - (180 / 8);
        let x = cx + cos(angle) * r;
        let y = cy + sin(angle) * r;
        vertex(x, y);
    }
    endShape(CLOSE);
}

function generatePattern2Blocks (bw, bh) {
    let boxes = [];
    let areaRatio = (bw * bh) / max(1, squareSize * squareSize);
    let maxBoxes = constrain(floor(areaRatio / 2), 1, 3);
    let numBoxes = floor(random(1, maxBoxes + 1));
    let attempts = 0;
    let maxAttempts = 50;
    let pad = max(3, min(8, min(bw, bh) * 0.12));
    let minPatternSize = max(10, min(16, min(bw, bh) * 0.4));
    
    while (boxes.length < numBoxes && attempts < maxAttempts) {
        attempts++;
        
        if (bw <= (pad * 2 + minPatternSize) || bh <= (pad * 2 + minPatternSize)) break; 
        
        let pw = random(minPatternSize, bw - pad * 2); 
        let ph = random(minPatternSize, bh - pad * 2);
        
        let px = random(pad, bw - pad - pw); 
        let py = random(pad, bh - pad - ph);
        
        let isOverlapping = false;
        let overlapPad = max(2, pad * 0.5); 
        
        for (let i = 0; i < boxes.length; i++) {
            let existing = boxes[i];
            if (
                px < existing.x + existing.w + overlapPad &&
                px + pw + overlapPad > existing.x &&
                py < existing.y + existing.h + overlapPad &&
                py + ph + overlapPad > existing.y
            ) {
                isOverlapping = true;
                break;
            }
        }
        
        if (!isOverlapping) {
            boxes.push({ x: px, y: py, w: pw, h: ph });
        }
    }
    
    return boxes;
}

function drawPattern2Blocks(b, v1) {
    push();
    translate(v1.x, v1.y, v1.z + 2); 
    scale(0.6); 
    
    for (let j = 0; j < b.pattern2Blocks.length; j++) {
        let box = b.pattern2Blocks[j];

        let rowHeight = max(8, min(16, box.h * 0.3));
        let rowGap = max(4, min(8, rowHeight * 0.5));
        let dotInset = max(4, min(8, rowHeight * 0.5));
        let dotStep = dotInset;
        let dotSize = max(1.5, min(2.5, rowHeight * 0.15));
        
        let currentY = box.y;
        
        while (currentY + rowHeight <= box.y + box.h) {
            
            fill(255);
            stroke(150);
            strokeWeight(0.3);
            rect(box.x, currentY, box.w, rowHeight);
            
            fill(150);
            noStroke();
            let currentX = box.x + dotInset;
            
            while (currentX <= box.x + box.w - dotInset) {
                ellipse(currentX, currentY + rowHeight / 2, dotSize, dotSize);
                currentX += dotStep;
            }
            currentY += rowHeight + rowGap; 
        }
    }
    pop();
}

function generatePattern3() {
    pattern3Positions = []; 

    if (totalRows < 8 || gutterIntersections.length === 0) {
        return;
    }
    
    let topLeft_minRows = 2; 
    let topLeft_maxRows = floor(totalRows / 2) - 1;
    let topLeft_minCol = 2;
    let topLeft_maxCol = floor(gridCols / 2) - 1;
    placeSinglePattern3(topLeft_minRows, topLeft_maxRows, topLeft_minCol, topLeft_maxCol);

    let topRight_minRows = 2;
    let topRight_maxRows = floor(totalRows / 2) - 1;
    let topRight_minCol = floor(gridCols / 2) + 1;
    let topRight_maxCol = gridCols - 4;
    placeSinglePattern3(topRight_minRows, topRight_maxRows, topRight_minCol, topRight_maxCol);

    let bottomLeft_minRows = floor(totalRows / 2) + 1;
    let bottomLeft_maxRows = totalRows - 3;
    let bottomLeft_minCol = 2;
    let bottomLeft_maxCol = floor(gridCols / 2) - 1;
    placeSinglePattern3(bottomLeft_minRows, bottomLeft_maxRows, bottomLeft_minCol, bottomLeft_maxCol);

    let bottomRight_minRows = floor(totalRows / 2) + 1;
    let bottomRight_maxRows = totalRows - 3;
    let bottomRight_minCol = floor(gridCols / 2) + 1;
    let bottomRight_maxCol = gridCols - 4;
    placeSinglePattern3(bottomRight_minRows, bottomRight_maxRows, bottomRight_minCol, bottomRight_maxCol);
}

function placeSinglePattern3(minRows, maxRows, minCol, maxCol, maxPatterns = 3) {
    let attempts = 0;
    let placedCount = 0;

    if (maxRows <= minRows || maxCol <= minCol) {
        return;
    }

    let safeDistance = 50;

    while (attempts < 100 && placedCount < maxPatterns) {
        attempts++;

        let row = floor(random(minRows, maxRows));
        let column = floor(random(minCol, maxCol));

        if (gutterIntersections[row] && gutterIntersections[row][column]) {
            let position = gutterIntersections[row][column];
            
            let tooClose = false;

            for (let i = 0; i < pattern1Positions.length; i++) {
                let p1 = pattern1Positions[i];
                if (dist(p1.x, p1.y, position.x, position.y) < safeDistance) {
                    tooClose = true;
                    break;
                }
            }

            for (let i = 0; i < pattern3Positions.length && !tooClose; i++) {
                let p3 = pattern3Positions[i];
                if (dist(p3.position.x, p3.position.y, position.x, position.y) < safeDistance) {
                    tooClose = true;
                }
            }

            if (!tooClose) {
                pattern3Positions.push({
                    position: position,
                    scale: random(0.1, 0.4)
                });

                placedCount++;
            }
        }
    }
}


function drawPattern3(leftTip, rightTip, topTip, bottomTip,s){
    let radius = 80; 
    let gap = 4/s;
    let centerX = 0; 
    let centerY = 0;

    let offset = sqrt(radius * radius - (gap * gap)); 

    const p = {
        topL:    { x: -gap,    y: -offset },
        topR:    { x: gap,     y: -offset },
        rightT:  { x: offset,  y: -gap    },
        rightB:  { x: offset,  y: gap     },
        bottomR: { x: gap,     y: offset  },
        bottomL: { x: -gap,    y: offset  },
        leftB:   { x: -offset, y: gap     },
        leftT:   { x: -offset, y: -gap    }
    };

    fill(255);
    stroke(200);
    strokeWeight(0.3);

    beginShape();
    vertex(p.topL.x, p.topL.y);
    vertex(-gap, topTip);
    vertex(gap, topTip);
    vertex(p.topR.x, p.topR.y);
    drawPatternArc(p.topR, p.rightT, centerX, centerY, radius);
    vertex(p.rightT.x, p.rightT.y);
    vertex(rightTip, -gap);
    vertex(rightTip, gap);
    vertex(p.rightB.x, p.rightB.y);
    drawPatternArc(p.rightB, p.bottomR, centerX, centerY, radius);
    vertex(p.bottomR.x, p.bottomR.y);
    vertex(gap, bottomTip);
    vertex(-gap, bottomTip);
    vertex(p.bottomL.x, p.bottomL.y);
    drawPatternArc(p.bottomL, p.leftB, centerX, centerY, radius);
    vertex(p.leftB.x, p.leftB.y);
    vertex(leftTip, gap);
    vertex(leftTip, -gap);
    vertex(p.leftT.x, p.leftT.y);
    drawPatternArc(p.leftT, p.topL, centerX, centerY, radius);
    endShape(CLOSE);

    fill(250); 
    stroke(200);
    ellipse(0, 0, radius * 1.3, radius * 1.3);

    push();
    stroke(255);
    beginShape(); 
    vertex(-gap, topTip);
    vertex(gap, topTip);
    endShape(CLOSE); 

    beginShape(); 
    vertex(rightTip, -gap);
    vertex(rightTip, gap);
    endShape(CLOSE); 

    beginShape(); 
    vertex(gap, bottomTip);
    vertex(-gap, bottomTip);
    endShape(CLOSE); 

    beginShape(); 
    vertex(leftTip, gap);
    vertex(leftTip, -gap);
    endShape(CLOSE); 

    pop();
}

function drawPatternArc(startPoint, endPoint, centerX, centerY, radius) {
    let startAngle = atan2(startPoint.y - centerY, startPoint.x - centerX);
    let endAngle = atan2(endPoint.y - centerY, endPoint.x - centerX);

    let diff = endAngle - startAngle;
    if (diff > 180) endAngle -= 360;
    if (diff < -180) endAngle += 360;

    let steps = 15; 
    for (let i = 0; i <= steps; i++) {
        let a = lerp(startAngle, endAngle, i / steps);
        vertex(centerX + cos(a) * radius, centerY + sin(a) * radius);
    }
}
function drawPattern3s() {
    for (let i = 0; i < pattern3Positions.length; i++) {
        let item = pattern3Positions[i];
        let position = item.position; 
        let s = item.scale; 

        push();
        translate(position.x, position.y, 2);
        scale(s); 

        let leftTip = (gridLeft - position.x) / s;
        let rightTip = (gridRight - position.x) / s;
        let topTip = (gridTop - position.y) / s;
        let bottomTip = (gridBottom - position.y) / s;

        drawPattern3(leftTip, rightTip, topTip, bottomTip, s);
        pop(); 
    }
}

function mousePressed() {
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    let hingeY = (-height / 2) + 64;
    let leftPageWidth = width / 4 - 36;
    let leftHingeX = -width / 4 + 28 + 1;

    // Menu Selection
    if (targetRotateLeft === 0) {
        let menuX = leftHingeX - leftPageWidth + 20;
        let menuY = hingeY + 64;
        if (mx > menuX && mx < menuX + 120 && my > menuY && my < menuY + 40) {
            isMenuOpen = !isMenuOpen;
            return;
        }
        if (isMenuOpen) {
            for (let i = 0; i < countryList.length; i++) {
                let itemY = menuY + 40 + (i * 30);
                if (mx > menuX && mx < menuX + 120 && my > itemY && my < itemY + 30) {
                    selectedCountryIndex = i;
                    isMenuOpen = false;
                    generateQuarterPaths(); // Reset map khi chọn quốc gia
                    return;
                }
            }
        }
    }

    // Page Flipping
    let leftIsOpened = (targetRotateLeft === 180); 
    let leftMinX = leftIsOpened ? leftHingeX : leftHingeX - leftPageWidth;
    let leftMaxX = leftIsOpened ? leftHingeX + leftPageWidth : leftHingeX;

    if (mx > leftMinX && mx < leftMaxX && my > hingeY && my < hingeY + height - 128) {
        targetRotateLeft = leftIsOpened ? 0 : 180;
    }

    let rightPageWidth = width / 4 - 36;
    let rightHingeX = width / 4 - 32 + 4;
    let rightIsOpened = (targetRotateRight === 0);
    let rightMinX = rightIsOpened ? rightHingeX : rightHingeX - rightPageWidth;
    let rightMaxX = rightIsOpened ? rightHingeX + rightPageWidth : rightHingeX;

    if (mx > rightMinX && mx < rightMaxX && my > hingeY && my < hingeY + height - 128) {
        targetRotateRight = rightIsOpened ? -180 : 0;
    }
}

// --- GIỮ NGUYÊN CÁC HÀM VẼ HỆ THỐNG GRID/BLOCKS TỪ SOURCE GỐC ---
function drawMiddlePage() {
    let pageWidth = (width / 4 - 32) * 2 + 8;
    let pageHeight = height - 128;
    push();
    translate(-width / 4 + 32 - 4, (-height / 2) + 64);
    fill(254); stroke(0);
    rect(0, 0, pageWidth, pageHeight);
    pop();
}


function drawSelectedQuarterPoints() {
    if (selectedQuarters.length === 0 || !mathTable || mathTable.getRowCount() === 0) return;

    let hingeX = -width / 4 + 32 - 4; 
    let hingeY = (-height / 2) + 64;

    push();
    translate(hingeX, hingeY, 1.1); 

    for (let pathObj of activePaths) {
        // 1. Draw the connected path with nice rounded styling
        push();
        noFill();
        stroke(0); // Kept black to match book theme, adjust to 230 if you want it light!
        strokeWeight(1.5);
        strokeJoin(ROUND); // The styling you liked
        strokeCap(ROUND);  // The styling you liked
        
        beginShape();
        for (let p of pathObj.points) vertex(p.x, p.y);
        endShape();
        pop();

        // 2. Draw circles at ends
        fill(0); 
        noStroke();
        ellipse(pathObj.leftX, pathObj.leftY, 6, 6); 
        ellipse(pathObj.rightX, pathObj.rightY, 6, 6); 
        
        // 3. Draw score text
        push();
        fill(0);
        textAlign(RIGHT, CENTER);
        textFont(myFontNormal);
        textSize(10);
        text(pathObj.score, pathObj.rightX - 10, pathObj.rightY); 
        pop();
    }
    
    pop();
}

function generateBackgroundPaths() {
    backgroundPaths = [];
    if (!gutterIntersections || gutterIntersections.length < 3) return;
    
    let maxRows = gutterIntersections.length;
    let maxCols = gutterIntersections[0].length;
    let count = floor(random(5, 12)); // Number of paths
    
    let hingeX = -width / 4 + 32 - 4; 
    let hingeY = (-height / 2) + 64;
    
    for (let i = 0; i < count; i++) {
        // Start safely in the middle of the left side (avoiding starting exactly on top/bottom edge)
        let r = floor(random(1, maxRows - 1)); 
        let c = 0; 
        let path = [{r: r, c: c}];
        
        // Randomly decide which edge this specific path is trying to reach!
        // 0 = Top Edge, 1 = Bottom Edge, 2 = Right Edge
        let targetEdge = floor(random(3)); 
        
        let reachedEnd = false;
        let attempts = 0; // Failsafe to prevent infinite loops
        
        // Keep moving until it physically touches the target edge
        while (!reachedEnd && attempts < 300) {
            attempts++;
            
            let dr = 0; // vertical direction
            let dc = 0; // horizontal direction
            
            if (targetEdge === 0) { 
                // Trying to reach the TOP
                dr = random() > 0.4 ? -1 : 0; // High chance to go UP
                dc = random() > 0.5 ? 1 : 0;  // Drift right
            } 
            else if (targetEdge === 1) { 
                // Trying to reach the BOTTOM
                dr = random() > 0.4 ? 1 : 0;  // High chance to go DOWN
                dc = random() > 0.5 ? 1 : 0;  // Drift right
            } 
            else { 
                // Trying to reach the RIGHT
                dr = floor(random(-1, 2));    // Up, down, or straight
                dc = random() > 0.3 ? 1 : 0;  // High chance to go RIGHT
            }
            
            // Force movement if the random math accidentally picks (0,0)
            if (dr === 0 && dc === 0) {
                if (targetEdge === 0) dr = -1;
                else if (targetEdge === 1) dr = 1;
                else dc = 1;
            }
            
            r += dr;
            c += dc;
            
            // Check if we hit ANY of the boundaries, and STOP if we do!
            if (r <= 0) { 
                r = 0; 
                reachedEnd = true; 
            }
            if (r >= maxRows - 1) { 
                r = maxRows - 1; 
                reachedEnd = true; 
            }
            if (c >= maxCols - 1) { 
                c = maxCols - 1; 
                reachedEnd = true; 
            }
            
            let last = path[path.length - 1];
            if (last.r !== r || last.c !== c) {
                path.push({r: r, c: c});
            }
        }
        
        // Convert grid indices to local canvas coordinates
        let localPath = [];
        for (let node of path) {
            let g = gutterIntersections[node.r][node.c];
            localPath.push({x: g.x - hingeX, y: g.y - hingeY});
        }
        
        backgroundPaths.push({
            points: localPath, 
            weight: random(1, 2.5) // The random thickness
        });
    }
}

function generateQuarterPaths() {
    activePaths = []; 
    pathRevealProgress = 0;
    if (!gutterIntersections || gutterIntersections.length < 5) return;

    let maxRows = gutterIntersections.length;
    let maxCols = gutterIntersections[0].length;
    
    let palette = [
        color(248, 50, 147), color(255, 178, 7), 
        color(6, 124, 224), color(254, 21, 24)
    ];

    let idx1 = floor(random(palette.length));
    let idx2;
    do { idx2 = floor(random(palette.length)); } while (idx1 === idx2);
    let chosenColors = [palette[idx1], palette[idx2]];

    commonStartNode = {
        r: floor(random(maxRows * 0.3, maxRows * 0.7)),
        c: floor(random(maxCols * 0.1, maxCols * 0.15)) // Bắt đầu lùi lại một chút
    };

    commonEndNode = {
        r: floor(random(maxRows * 0.3, maxRows * 0.7)),
        c: floor(random(maxCols * 0.75, maxCols * 0.85)) // Goal nằm trong khoảng 80% bản đồ
    };

    for (let i = 0; i < 2; i++) {
        let pathGridNodes = [{r: commonStartNode.r, c: commonStartNode.c}];
        let currentR = commonStartNode.r;
        let currentC = commonStartNode.c;
        let waypoints = [];
        let isSuccess = (i === 0);

        if (isSuccess) { 
            // ĐƯỜNG NGẮN: Tới đích
            waypoints.push({r: commonEndNode.r, c: commonEndNode.c});
        } 
        else {
            // ĐƯỜNG DÀI: Né đích và kết thúc ở một điểm cụ thể trong map
            let buffer = 4; 

            // Tạo các điểm trung gian
            for(let j = 0; j < 6; j++) {
                let wpR, wpC;
                let attempts = 0;
                do {
                    wpR = floor(random(2, maxRows - 2));
                    wpC = floor(lerp(commonStartNode.c, maxCols - 4, (j + 1) / 7));
                    attempts++;
                } while (attempts < 20 && Math.abs(wpR - commonEndNode.r) < buffer && Math.abs(wpC - commonEndNode.c) < buffer);
                waypoints.push({r: wpR, c: wpC});
            }

            // ĐIỂM KẾT THÚC CỦA HARD PATH (End point)
            // Cho nó dừng ở khoảng cột 90% thay vì cột cuối cùng để không bị mất
            let finalC = floor(random(maxCols * 0.85, maxCols - 2));
            let finalR;
            do { 
                finalR = floor(random(2, maxRows - 2)); 
            } while (Math.abs(finalR - commonEndNode.r) < buffer);
            
            waypoints.push({r: finalR, c: finalC});
        }

        // Tính toán lộ trình chi tiết
        for(let wp of waypoints) {
            let corners = getGridConnectionCorners(
                currentR, currentC, 
                wp.r, wp.c, 
                (i === 1 ? commonEndNode : null) 
            );

            pathGridNodes = pathGridNodes.concat(corners);
            currentR = wp.r; 
            currentC = wp.c;
        }

        let pts = [];
        let hingeX = -width / 4 + 32 - 4; 
        let hingeY = (-height / 2) + 64;
        for(let node of pathGridNodes) {
            // Kiểm tra an toàn để không truy cập index ngoài mảng
            let safeR = constrain(node.r, 0, maxRows - 1);
            let safeC = constrain(node.c, 0, maxCols - 1);
            let g = gutterIntersections[safeR][safeC];
            pts.push({x: g.x - hingeX, y: g.y - hingeY});
        }

        activePaths.push({
            points: pts,
            qIndex: i === 0 ? 3 : 0, 
            isSuccess: isSuccess,
            color: chosenColors[i]
        });
    }
}
function getPathColor(idx) {
    if (idx === 3) return color(248, 50, 147); // Top - Hồng
    if (idx === 2) return color(255, 178, 7);  // Cam
    if (idx === 1) return color(6, 124, 224);  // Xanh
    return color(254, 21, 24);                // Bottom - Đỏ
}

// ---------------------------------------------------------
// Core Math: Forces any connection on the grid to strictly be 0, 45, or 90 degrees
// ---------------------------------------------------------
function getGridConnectionCorners(r1, c1, r2, c2, forbiddenNode = null) {
    let nodes = [];
    let r = r1;
    let c = c1;

    // Giới hạn số vòng lặp để tránh treo trình duyệt
    let safetyCounter = 0;

    while ((r !== r2 || c !== c2) && safetyCounter < 500) {
        safetyCounter++;
        let dr = Math.sign(r2 - r);
        let dc = Math.sign(c2 - c);

        let nextR = r;
        let nextC = c;

        // Thử đi chéo trước
        if (dr !== 0 && dc !== 0) {
            nextR = r + dr;
            nextC = c + dc;
        } else if (dr !== 0) {
            nextR = r + dr;
        } else {
            nextC = c + dc;
        }

        // KIỂM TRA NÉ GOAL:
        if (forbiddenNode && nextR === forbiddenNode.r && nextC === forbiddenNode.c) {
            // Nếu bước tiếp theo là Goal, thay đổi hướng đi
            if (dr !== 0) {
                // Nếu đang định đi dọc, thử đi ngang thay thế
                r = r; 
                c = c + (c < (gutterIntersections[0].length - 1) ? 1 : -1);
            } else {
                // Nếu đang định đi ngang, thử đi dọc thay thế
                r = r + (r < (gutterIntersections.length - 1) ? 1 : -1);
                c = c;
            }
        } else {
            r = nextR;
            c = nextC;
        }

        nodes.push({ r, c });
    }

    return nodes;
}

function drawBackgroundPaths() {
    if (!backgroundPaths || backgroundPaths.length === 0) return;
    
    let hingeX = -width / 4 + 32 - 4; 
    let hingeY = (-height / 2) + 64;
    push();
    translate(hingeX, hingeY, 0); // Placed slightly behind data points (z=1.5)
    
    noFill();
    stroke(220); // The color you requested
    strokeJoin(ROUND);
    strokeCap(ROUND);
    
    for (const pathObj of backgroundPaths) {
        if (!pathObj.points || pathObj.points.length < 2) continue;
        strokeWeight(pathObj.weight); // The random thickness you requested
        beginShape();
        for (const p of pathObj.points) vertex(p.x, p.y);
        endShape();
    }
    pop();
}

function drawSelectedQuarterPoints() {
    if (activePaths.length === 0) return;
    
    // Tăng tiến độ reveal (tốc độ vẽ đường kẻ)
    if (pathRevealProgress < 1) pathRevealProgress += 0.005;

    let hingeX = -width / 4 + 32 - 4; 
    let hingeY = (-height / 2) + 64;
    
    push();
    translate(hingeX, hingeY, 5); 

    // 1. Vẽ điểm bắt đầu chung (Hành trình bắt đầu)
    let startPoint = gutterIntersections[commonStartNode.r][commonStartNode.c];
    fill(0); 
    noStroke();
    ellipse(startPoint.x - hingeX, startPoint.y - hingeY, 8, 8);

    // 2. Vẽ Goal (Đích đến chung)
    let endPoint = gutterIntersections[commonEndNode.r][commonEndNode.c];
    let gx = endPoint.x - hingeX;
    let gy = endPoint.y - hingeY;
    let pulse = 12 + sin(frameCount * 6) * 2;

    noFill();
    stroke(0); 
    strokeWeight(1.5);
    ellipse(gx, gy, pulse * 3); // Vòng tròn hiệu ứng pulse
    fill(0);
    noStroke();
    ellipse(gx, gy, 10, 10); // Tâm đích
    
    textSize(11);
    textAlign(CENTER);
    text('GOAL', gx, gy - 18);

    // 3. Vẽ các đường dẫn
    for (let path of activePaths) {
        let totalLen = 0;
        for(let i = 0; i < path.points.length - 1; i++) {
            totalLen += dist(path.points[i].x, path.points[i].y, path.points[i+1].x, path.points[i+1].y);
        }

        // Tốc độ khác nhau cho 2 loại đường
        let baseSpeed = path.isSuccess ? 3.5 : 2.5; 
        let targetLen = pathRevealProgress * baseSpeed * totalLen;
        targetLen = constrain(targetLen, 0, totalLen);
        
        let dLen = 0;

        push();
        noFill();
        stroke(path.color); 
        strokeWeight(path.isSuccess ? 3.5 : 1.5); 
        strokeJoin(ROUND); 
        strokeCap(ROUND);

        beginShape();
        for (let i = 0; i < path.points.length - 1; i++) {
            let p1 = path.points[i];
            let p2 = path.points[i+1];
            let seg = dist(p1.x, p1.y, p2.x, p2.y);

            if (dLen + seg < targetLen) {
                vertex(p1.x, p1.y);
                if(i === path.points.length - 2) vertex(p2.x, p2.y);
                dLen += seg;
            } else {
                let r = (targetLen - dLen) / seg;
                let x = lerp(p1.x, p2.x, r);
                let y = lerp(p1.y, p2.y, r);
                vertex(p1.x, p1.y);
                vertex(x, y);
                break;
            }
        }
        endShape();
        pop();

        // 4. VẼ ĐIỂM KẾT THÚC (KHI ĐÃ CHẠY XONG)
        // Nếu đường đi đã vẽ đạt tới điểm cuối cùng của mảng points
        if (targetLen >= totalLen) {
            let last = path.points[path.points.length - 1];
            push();
            fill(path.color);
            noStroke();
            
            if (path.isSuccess) {
                // Đường thành công -> Hình tròn nhỏ
                ellipse(last.x, last.y, 6, 6);
            } else {
                // Đường thất bại (Hard line) -> Hình vuông nhỏ (Dead end)
                rectMode(CENTER);
                rect(last.x, last.y, 7, 7); 
            }
            pop();
        }
    }
    pop();
}

function mouseDragged() {
    if (isDraggingSlider) {
        let mx = mouseX - width / 2;
        let rightPageWidth = width / 4 - 36;
        let rightHingeX = width / 4 - 32 + 4 - 1;
        
        let boxX = 16;
        let boxWidth = rightPageWidth - 32;
        let trackMinX = rightHingeX + boxX + 15;
        let trackMaxX = rightHingeX + boxX + boxWidth - 15;
        
        sliderPct = constrain(map(mx, trackMinX, trackMaxX, 0, 1), 0, 1);
    }
}

function mouseReleased() {
    isDraggingSlider = false; // Stop dragging when they let go
}

function createNavigationBar() {
    // 1. Create the main navigation bar container
    let navBar = createDiv();
    navBar.addClass('navigation-bar');
    
    // 2. Create the title link
    let navTitle = createA('index.html', 'Not All Paths Are The Same');
    navTitle.addClass('canvas-title');
    navTitle.parent(navBar);
    
    // 3. Create the hamburger button container
    let menuBtn = createDiv();
    menuBtn.addClass('button-menu');
    menuBtn.parent(navBar);
    
    // 4. Create the two lines for the hamburger button
    let topDiv = createDiv();
    topDiv.id('top');
    topDiv.parent(menuBtn);
    
    let bottomDiv = createDiv();
    bottomDiv.id('bottom');
    bottomDiv.parent(menuBtn);
    
    // 5. Add the click interaction to toggle the "X" animation!
    menuBtn.mousePressed(() => {
        menuBtn.toggleClass('is-open');
        
        // Optional: You can add code here to open your map menu!
        // isMenuOpen = !isMenuOpen;
    });
}
function initMenuButton() {
  const menuButton = document.querySelector(".button-menu");
  if (!menuButton) return;

  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("is-open");
  });
}

initMenuButton();



