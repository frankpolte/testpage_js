
// constants

const paper = {
    A4: {x: 595.28, y: 841.89},
    A5: {x: 419.53, y: 595.28},
    A6: {x: 297.64, y: 419.53}
};

const cm = 0.393701 * 72;
const gridLen = 2;
const gridSize = gridLen * cm;
const dotRadius = 3;
const smallTextOpt = {width: 40, height: 10}

const header = "Din-A4 Testseite zur Druckerkalibrierung"
const helpText = "\nDie Quadrate haben eine Kantenlänge von jeweils 20mm und die Unterkästchen 5mm.\nDas sind die Daten für Abstandsmessungen zu den Kanten auf einem Blatt Din-A4."
const dataText = "\nolx    = oly    = A6-ory = A5-ory = A6-ulx = A5-ulx = 20mm\nA4-ulx = A4-orx = A4-ory = A4-uly = A4-ury = A4-urx = 20mm\nA6-orx = A6-urx = 125mm\nA5-orx = A5-urx = 82mm\nA6-uly = A6-ury = 169mm\nA5-uly = A5-ury = 107mm"


// functions 

function drawGrid(doc, upperLeft, lowerRight, divider, lineWidth = 2) {
    //console.log(upperLeft, lowerRight);
    let vertStepSize = (lowerRight[0] - upperLeft[0]) / divider;
    let horizStepSize = (lowerRight[1] - upperLeft[1]) / divider;

    let startVert = null;
    let startHoriz = null;
    for (let i=0; i <= divider; i++) {
        // vertical
        startVert = upperLeft[0] + (vertStepSize*i);
        //console.log("start vertical: ", startVert)
        doc
          .moveTo(startVert, upperLeft[1])
          .lineTo(startVert, lowerRight[1])
          .stroke();
        // horizontal
        startHoriz = upperLeft[1] + (horizStepSize*i);
        //console.log("start horizontal: ", startHoriz)
        doc
          .moveTo(upperLeft[0], startHoriz)
          .lineTo(lowerRight[0], startHoriz)
          .stroke();
    }
}

function drawVertArrow(doc, startPoint, len, text, textPos) {
    let fontSize;
    if (len<0) 
      {fontSize = -1*len/3}
    else
      {fontSize = len/3}

    textPoint = [startPoint[0] + textPos[0], startPoint[1] + textPos[1]];
    doc.fontSize(fontSize).text(text, textPoint[0], textPoint[1], smallTextOpt);

    endPoint = [startPoint[0], startPoint[1] + len];
    headLen = len / 4;
    headWidth = headLen / 2;
    let headP1 = [endPoint[0], endPoint[1]];
    let headP2 = [endPoint[0]-headWidth,endPoint[1]-headLen];
    let headP3 = [endPoint[0]+headWidth,endPoint[1]-headLen];
    // draw arrow
    //console.log(startPoint, endPoint);
    doc
      .moveTo(startPoint[0], startPoint[1])
      .lineTo(endPoint[0], endPoint[1])
      .stroke()
      .polygon(headP1, headP2, headP3)
      .fill("black")
      .stroke();
}

function drawHorizArrow(doc, startPoint, len, text, textPos) {
    let fontSize;
    if (len<0) 
      {fontSize = -1*len/3}
    else
      {fontSize = len/3}

    textPoint = [startPoint[0] + textPos[0], startPoint[1] + textPos[1]];
    doc.fontSize(fontSize).text(text, textPoint[0], textPoint[1], smallTextOpt);

    endPoint = [startPoint[0] + len, startPoint[1]];
    headLen = len / 4;
    headWidth = headLen / 2;
    let headP1 = [endPoint[0], endPoint[1]];
    let headP2 = [endPoint[0]-headLen,endPoint[1]-headWidth];
    let headP3 = [endPoint[0]-headLen,endPoint[1]+headWidth];
    // draw arrow
    //console.log(startPoint, endPoint);
    doc
      .moveTo(startPoint[0], startPoint[1])
      .lineTo(endPoint[0], endPoint[1])
      .stroke()
      .polygon(headP1, headP2, headP3)
      .fill("black")
      .stroke();
}


function drawTestPage(doc, xSize, ySize, gridSize, dotRadius, textIdx, firstPattern = false) {
  if (firstPattern) {
      //upperLeft
      drawGrid(doc, [0,0], [gridSize, gridSize], 4);
      let circlePoint = [gridSize, gridSize];
      doc
        .circle(circlePoint[0], circlePoint[1], dotRadius)
        .fill("black")
        .moveTo(circlePoint[0] + (cm/6), circlePoint[1])
        .lineTo(circlePoint[0] + (cm/2), circlePoint[1])
        .moveTo(circlePoint[0], circlePoint[1] + (cm/6))
        .lineTo(circlePoint[0], circlePoint[1] + (cm/2))
        .stroke();
      drawVertArrow(doc, [circlePoint[0] + (cm/3), circlePoint[1]], -cm, "oly", [cm/6,-cm/2]);
      drawHorizArrow(doc, [circlePoint[0], circlePoint[1]+(cm/3)], -cm, "olx", [-cm/2, cm/6]);
  }
  //console.log("upperRight");
  drawGrid(doc, [xSize-gridSize, 0], [xSize, gridSize], 4);
  circlePoint = [xSize-gridSize, gridSize]
  doc
    .circle(circlePoint[0], circlePoint[1], dotRadius)
    .fill("black")
    .moveTo(circlePoint[0] - (cm/6), circlePoint[1])
    .lineTo(circlePoint[0] - (cm/2), circlePoint[1])
    .moveTo(circlePoint[0], circlePoint[1] + (cm/6))
    .lineTo(circlePoint[0], circlePoint[1] + (cm/2))
    .stroke();
  drawVertArrow(doc, [circlePoint[0] - (cm/3), circlePoint[1]], -cm, textIdx+"-ory", [-1.1*cm,-cm/2]);
  drawHorizArrow(doc, [circlePoint[0], circlePoint[1]+(cm/3)], cm, textIdx+"-orx", [0.1, cm/6]);
  //console.log("lowerLeft");
  drawGrid(doc, [0, ySize], [gridSize, ySize-gridSize], 4);
  circlePoint = [gridSize, ySize-gridSize]
  doc
    .circle(circlePoint[0], circlePoint[1], dotRadius)
    .fill("black")
    .moveTo(circlePoint[0] + (cm/6), circlePoint[1])
    .lineTo(circlePoint[0] + (cm/2), circlePoint[1])
    .moveTo(circlePoint[0], circlePoint[1] - (cm/6))
    .lineTo(circlePoint[0], circlePoint[1] - (cm/2))
    .stroke();
  drawVertArrow(doc, [circlePoint[0] + (cm/3), circlePoint[1]], +cm, textIdx+"-uly", [cm/6,cm/4]);
  drawHorizArrow(doc, [circlePoint[0], circlePoint[1]-(cm/3)], -cm, textIdx+"-ulx", [-cm, -cm/2]);
  //console.log("lowerRight");
  drawGrid(doc, [xSize, ySize-gridSize], [xSize-gridSize, ySize], 4);
  circlePoint = [xSize-gridSize, ySize-gridSize]
  doc
    .circle(circlePoint[0], circlePoint[1], dotRadius)
    .fill("black")
    .moveTo(circlePoint[0] - (cm/6), circlePoint[1])
    .lineTo(circlePoint[0] - (cm/2), circlePoint[1])
    .moveTo(circlePoint[0], circlePoint[1] - (cm/6))
    .lineTo(circlePoint[0], circlePoint[1] - (cm/2))
    .stroke();
  drawVertArrow(doc, [circlePoint[0] - (cm/3), circlePoint[1]], cm, textIdx+"-ury", [-1.1*cm,cm/4]);
  drawHorizArrow(doc, [circlePoint[0], circlePoint[1]-(cm/3)], cm, textIdx+"-urx", [0,-cm/2]);
}

///////////////////////////////////////////////////////////////////////////////

/// test page definition (main part)

const PDFDocument = require('pdfkit');
const fs = require('fs');

// document definition
var doc = new PDFDocument({info: {CreationDate: new Date(Date.UTC(2018, 1, 1)) },
                           autoFirstPage: false});

doc.addPage({
        layout: "portrait",
        size: "A4",
        bufferPages: true,
        autoFirstPage: false,
        compress: false,
        magins: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
    });


// draw some text
doc.fontSize(25).text(header, 100, 150);
doc.fontSize(12).font('Times-Roman').text(helpText)
doc.fontSize(10).font('Courier').text(dataText)

//create test page(s)
doc.fontSize(12).font('Times-Roman')
drawTestPage(doc, paper.A6.x, paper.A6.y, gridSize, dotRadius, "A6", true);
drawTestPage(doc, paper.A5.x, paper.A5.y, gridSize, dotRadius, "A5");
drawTestPage(doc, paper.A4.x, paper.A4.y, gridSize, dotRadius, "A4");


doc.save();
doc.restore();
// end and display the document in the iframe to the right

doc.pipe(fs.createWriteStream('./testpage.pdf')); // write to PDF


doc.save();
doc.restore();

// finalize the PDF and end the stream
doc.end();
