// Name: Anika Srinivasan
// Student Number: 20995090

// Final Project - The Solar System

// Global Variables

	// Fonts
let titleFont;
let headingFont;
let bodyFont;

	// Canvas Dimensions
let margin;
let modelDiameter;
let modelX;
let modelY;

	// Planet Dimensions
let planetsDisplayed = 9;

let planets = {};
let planetSize = [];
let planetDistance = [];
let planetOrbit = [];

let ang = [];
let pt = [];

	// Screen Controls
let planetHit = [];
let modelView = true;
let pageIndex;

	// Planet Sprites
let spriteIndex = 0;
let spriteDataFile;
let row;

let sunSpriteSheet;
let mercurySpriteSheet;
let venusSpriteSheet;
let earthSpriteSheet;
let marsSpriteSheet;
let jupiterSpriteSheet;
let saturnSpriteSheet;
let uranusSpriteSheet;
let neptuneSpriteSheet;


function preload() {
	planets = loadJSON("solarSystem.json");

	// Fonts
	titleFont = loadFont("BITSUMIS.TTF");
	headingFont = loadFont("Bebas-Regular.ttf");
	bodyFont = loadFont("Ampero-Light.ttf")
	
	// Sprites
	spriteDataFile = loadStrings("planetSpriteData.txt");
	sunSpriteSheet = loadImage("sunSpriteSheet.png");
	mercurySpriteSheet = loadImage("mercurySpriteSheet.png");
	venusSpriteSheet = loadImage("venusSpriteSheet.png");
	earthSpriteSheet = loadImage("earthSpriteSheet.png");
	marsSpriteSheet = loadImage("marsSpriteSheet.png");
	jupiterSpriteSheet = loadImage("jupiterSpriteSheet.png");
	saturnSpriteSheet = loadImage("saturnSpriteSheet.png");
	uranusSpriteSheet = loadImage("uranusSpriteSheet.png");
	neptuneSpriteSheet = loadImage("neptuneSpriteSheet.png");
}


function setup() {
	createCanvas(1400, 750);
	initialization();
}


function draw() {
	if (modelView === true) {
		canvasSetup();
		scaleValues();
		planetaryModel();
	} else if (modelView === false) {
		planetPage(pageIndex);
	}
}


function mousePressed() {
	planetHitTest();
	for (let i = 0; i < planetsDisplayed; i++) {
		if (planetHit[i] === true) { // Click Planet Orbits
			pageIndex = i;
			modelView = false;
		}
	}
}


function keyPressed() {
	if (key === "+" || key === "=") { // Control Zoom and 
		planetsDisplayed--;
		if (planetsDisplayed < 2) {
			planetsDisplayed = 2;
		}
	} else if (key === "-" || key === "_") {
		planetsDisplayed++;
		if (planetsDisplayed > 9) {
			planetsDisplayed = 9;
		}
	} else if (keyCode === 32) { // Return to Model
		initialization();
		modelView = true;
	}
}


// Initialize Values and Controls
function initialization() {
	for (let i = 0; i < planets.information.length; i++) {
		ang[i] = 0;
		planetHit[i] = false;
	}

	// Set Up Sprites
	for (let i = 0; i < spriteDataFile.length; i++) {
		row = spriteDataFile[i].split(",");
		
		planets.sprites[0].images[i] = sunSpriteSheet.get(row[1], row[2], row[3], row[4]);
		planets.sprites[1].images[i] = mercurySpriteSheet.get(row[1], row[2], row[3], row[4]);
		planets.sprites[2].images[i] = venusSpriteSheet.get(row[1], row[2], row[3], row[4]);
		planets.sprites[3].images[i] = earthSpriteSheet.get(row[1], row[2], row[3], row[4]);
		planets.sprites[4].images[i] = marsSpriteSheet.get(row[1], row[2], row[3], row[4]);
		planets.sprites[5].images[i] = jupiterSpriteSheet.get(row[1], row[2], row[3], row[4]);
		planets.sprites[6].images[i] = saturnSpriteSheet.get(row[1], row[2], row[3], row[4]);
		planets.sprites[7].images[i] = uranusSpriteSheet.get(row[1], row[2], row[3], row[4]);
		planets.sprites[8].images[i] = neptuneSpriteSheet.get(row[1], row[2], row[3], row[4]);
	}
	
	// Canvas Dimensions
	margin = 50;
	modelDiameter = height - (2 * margin);
	modelX = width - (modelDiameter / 2) - margin;
	modelY = height - (modelDiameter / 2) - margin;

	strokeWeight(0.5);
}


// Set Up Canvas for Model of Solar System
function canvasSetup() {
	background(0);
	frameRate(60);
	
	// Background Stars
	randomSeed(10000);
	for (let stars = 0; stars < 2000; stars++) {
		noStroke();
		fill(255, random(50, 256));
		circle(random(0, width), random(0, height), random(0, 2));
	}

	// Model Outline
	fill(0);
	noStroke();
	circle(modelX, modelY, modelDiameter);

	// Title
	titleText();
	text("THE SOLAR \nSYSTEM", margin, margin);

	// Heading
	headingText();
	text("an interactive model", width / 4, height - 250);

	// Instructions
	subHeadingText();
	text("press + to maximize  |  press - to minimize \n\nfor more information about a planet, click inside its orbit", margin * 2, height - (margin * 3));
}


// Scale Down Planet Information to Fit On Screen
function scaleValues() {
	for (let i = 0; i < planetsDisplayed; i++) {
		// Distances Between Each Planet and The Sun
		let maxDistance = planets.information[0].distance;
		let minDistance = planets.information[0].distance;

		for (let n = 0; n < planetsDisplayed; n++) {
			if (planets.information[n].distance >= maxDistance) {
				maxDistance = planets.information[n].distance;
			}
			if (planets.information[n].distance <= minDistance) {
				minDistance = planets.information[n].distance;
			}
		}

		planetDistance[i] = map(planets.information[i].distance, minDistance, maxDistance, 0, modelDiameter / 2);

		// Planet Sizes
		let maxSize = planets.information[0].size;
		let minSize = planets.information[0].size;

		for (let n = 0; n < planetsDisplayed; n++) {
			if (planets.information[n].size >= maxSize) {
				maxSize = planets.information[n].size;
			}
			if (planets.information[n].size <= minSize) {
				minSize = planets.information[n].size;
			}
		}

		planetSize[i] = map(planets.information[i].size, minSize, maxSize, 600 * modelDiameter * (minSize / maxDistance), 600 * modelDiameter * (maxSize / maxDistance));
		planetSize[0] = map(planets.information[0].size, minSize, maxSize, 20 * modelDiameter * (minSize / maxDistance), 20 * modelDiameter * (maxSize / maxDistance));

		// Planet Orbits
		let maxOrbit = planets.information[0].orbit;
		let minOrbit = planets.information[0].orbit;

		for (let n = 0; n < planetsDisplayed; n++) {
			if (planets.information[n].orbit >= maxOrbit) {
				maxOrbit = planets.information[n].orbit;
			}
			if (planets.information[n].orbit <= minOrbit) {
				minOrbit = planets.information[n].orbit;
			}
		}

		planetOrbit[i] = map(planets.information[i].orbit, minOrbit, maxOrbit, 0, 2)
	}
}


// Draw Model of the Solar System with Orbit Paths and Planet Images
function planetaryModel() {
	for (let i = planetsDisplayed; i > 0; i--) {

		// Orbit Paths
		stroke(255);

		planetHitTest();
		if (planetHit[i - 1] === true) {
			fill(50);

			circle(modelX, modelY, 2 * planetDistance[i - 1]);

			subHeadingText();
			text(planets.information[i - 1].name, mouseX + 20, mouseY - 20);
		} else {
			fill(0);
			circle(modelX, modelY, 2 * planetDistance[i - 1]);
		}

		for (let n = 0; n < planets.information.length; n++) {
			planetHit[n] = false;
		}
	}

	for (let i = 0; i < planetsDisplayed; i++) {
		// Planet Movement
		pt[i] = polar(planetDistance[i], -ang[i]);

		// Planet Images
		imageMode(CENTER);
		image(planets.sprites[i].images[0], modelX + pt[i].x, modelY + pt[i].y, (168/94) * planetSize[i], planetSize[i]);
		ang[i] += planetOrbit[i];
	}
}


// UWaterloo Polar Function
function polar(r, theta) {
	let dt = radians(theta);
	let x = r * cos(dt);
	let y = r * sin(dt);
	return createVector(x, y);
}


// Test if Planet Orbits Have Been Clicked
function planetHitTest() {
	let d = dist(mouseX, mouseY, modelX, modelY);

	for (let i = planetsDisplayed; i > 1; i--) {
		if (d <= planetDistance[i - 1] && d > planetDistance[i - 2]) {
			planetHit[i - 1] = true;
		}
	}
	if (d <= planetSize[0] / 2 && d > 0) {
		planetHit[0] = true;
		planetHit[1] = false;
	}
}


// Draw Individual Planet Profile Pages for More Information About Each Planet
function planetPage(i) {
	background(0);
	frameRate(20);
	
	// Planet Sprite
	image(planets.sprites[i].images[spriteIndex], width/4, height/2, 504, 282);
	spriteIndex = (spriteIndex + 1) % (planets.sprites[i].images.length);
	
	titleText();
	text(planets.information[i].name, width / 2, margin);

	bodyText();
	text(planets.information[i].message, width / 2, 200); // planets.information[i].message

	subHeadingText();
	text("press SPACE to return", width / 2, height - (margin * 2));

}


// Text Formatting Functions

	// Format Title Text
function titleText() {
	if (modelView === true) {
		textFont(titleFont);
		textAlign(LEFT, TOP);
		textSize(120);
		stroke(255);
		strokeWeight(0.5);
		fill(50);
	} else if (modelView === false) {
		textFont(titleFont);
		textAlign(LEFT, TOP);
		textSize(75);
		stroke(255);
		strokeWeight(0.5);
		fill(100);
	}
}

	// Format Heading Text
function headingText() {
	textFont(headingFont);
	textAlign(CENTER);
	textSize(40);
	noStroke();
	fill(100);
}

	// Format Sub-Heading Text
function subHeadingText() {
	textFont(headingFont);
	textAlign(LEFT, TOP);
	textSize(20);
	noStroke();
	fill(200);
}

	// Format Body Text
function bodyText() {
	textFont(bodyFont);
	textAlign(LEFT, TOP);
	textSize(24);
	noStroke();
	fill(100);
}