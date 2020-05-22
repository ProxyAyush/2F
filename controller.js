$(document).ready(function () {
	
var questionNumber=0;
var questionBank=new Array();
var stage="#game1";
var stage2=new Object;
var questionLock=false;
var numberOfQuestions;
var score=0;
		 

		 
		 
		 

 
 		$.getJSON('activity.json', function(data) {

		for(i=0;i<data.quizlist.length;i++){ 
			questionBank[i]=new Array;
			questionBank[i][0]=data.quizlist[i].question;
			questionBank[i][1]=data.quizlist[i].option1;
			questionBank[i][2]=data.quizlist[i].option2;
			questionBank[i][3]=data.quizlist[i].option3;
		}
		 numberOfQuestions=questionBank.length; 
		
		 
		displayQuestion();
		})//gtjson
 
 



function displayQuestion(){
 var rnd=Math.random()*3;
rnd=Math.ceil(rnd);
 var q1;
 var q2;
 var q3;

if(rnd==1){q1=questionBank[questionNumber][1];q2=questionBank[questionNumber][2];q3=questionBank[questionNumber][3];}
if(rnd==2){q2=questionBank[questionNumber][1];q3=questionBank[questionNumber][2];q1=questionBank[questionNumber][3];}
if(rnd==3){q3=questionBank[questionNumber][1];q1=questionBank[questionNumber][2];q2=questionBank[questionNumber][3];}

$(stage).append('<div class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="option">'+q1+'</div><div id="2" class="option">'+q2+'</div><div id="3" class="option">'+q3+'</div>');

 $('.option').click(function(){
  if(questionLock==false){questionLock=true;	
  //correct answer
  if(this.id==rnd){
   $(stage).append('<div class="feedback1">CORRECT</div>');
   score++;
   }
  //wrong answer	
  if(this.id!=rnd){
   $(stage).append('<div class="feedback2">OOPS! WRONG</div>');
  }
  setTimeout(function(){changeQuestion()},1000);
 }})
}//display question

	
	
	
	
	
	function changeQuestion(){
		
		questionNumber++;
	
	if(stage=="#game1"){stage2="#game1";stage="#game2";}
		else{stage2="#game2";stage="#game1";}
	
	if(questionNumber<numberOfQuestions){displayQuestion();}else{displayFinalSlide();}
	
	 $(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
	 $(stage).animate({"right": "+=800px"},"slow", function() {questionLock=false;});
	}//change question
	

	
	
	function displayFinalSlide(){
		
		$(stage).append('<div class="questionText">You have Finished the quiz!<br>😁 Do Share with friends and family<br>Total questions: '+numberOfQuestions+'<br>Correct answers: '+score+'</div>');
		
	}//display final slide
	
	
	
	
	
	
	
	});//doc ready
	class Line {
	constructor(startPoint, endPoint) {
		this.startPoint = startPoint;
		this.endPoint = endPoint;
	}

	getPointAtPercentage(percentage) {
		const distance = this.startPoint.getDistance(this.endPoint);
		const desiredDistance = distance * percentage;
		const t = desiredDistance / distance;
		const getAxisAtPercentage = axis => (1 - t) * this.startPoint[axis] + this.endPoint[axis] * t;
		return new Point(getAxisAtPercentage('x'), getAxisAtPercentage('y'));
	}
	
	getLength() {
		return this.startPoint.getDistance(this.endPoint);
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	getDistance({ x: x2, y: y2 }) {
		const a = this.x - x2;
		const b = this.y - y2;
		return Math.sqrt(a * a + b * b);
	}
}

var c = document.getElementById('canv');
var $ = c.getContext('2d');
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var centerX = w / 2;
var centerY = h / 2;
var blackholeRadius = 50;
var arr = [];
var cnt = 0;

function anim() {
	cnt++;
	draw();
	window.requestAnimationFrame(anim);
}
anim();

var drawDebounce;
function draw() {
	if (!drawDebounce && arr.length < 20) {
		drawDebounce = debounce(() => {
			var line = new Line(new Point(rng(0, w), rng(0, h)), new Point(...getEdgePoint()));
			var newSplot = {
				line,
				percentageComplete: 0,
				r: 2,
				color: 'rgba(255, 255, 255, 0.3)',
			};

			arr.push(newSplot);
			drawDebounce = null;
		}, rng(200, 1000));
		drawDebounce()
	}
	
	$.clearRect(0, 0, w, h);

	for (var i = 0; i < arr.length; i++) {
		let splot = arr[i];

		$.fillStyle = splot.color;
		$.beginPath();

		splot.percentageComplete += .0005;
		const currentPoint = splot.line.getPointAtPercentage(splot.percentageComplete);

		$.arc(currentPoint.x, currentPoint.y, splot.r, 0, Math.PI * 2, true);
		
		arr.forEach(currSplot => {
			const currCircle = currSplot.line.getPointAtPercentage(currSplot.percentageComplete);
			if (currCircle != currentPoint) {
				const line = new Line (currentPoint, currCircle);
				if (line.getLength() < 100) {
					$.strokeStyle = 'rgba(255, 255, 255, 0.2)';
					$.lineWidth = 0;
					$.shadowColor = 'rgba(255, 255, 255, 0.3)';
					$.shadowBlur = 10;
					$.moveTo(currentPoint.x, currentPoint.y);
					$.lineTo(currCircle.x, currCircle.y);  
					$.stroke(); 
				}
			}
		})

		$.fill();
		
		if (splot.percentageComplete > 1) {
			arr.splice(i, 1);
		}
	}
}

function getEdgePoint() {
	const sideRandom = rng(0, 2);
	if (sideRandom === 0) {
		return [rng(0, 2) ? w : 0, rng(0, h)];	
	} else {
		return [rng(0, w), rng(0, 2) ? h : 0];	
	}
}

function rng(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function rndCol() {
	var r = Math.floor(Math.random() * 200);
	var g = Math.floor(Math.random() * 200);
	var b = Math.floor(Math.random() * 200);
	return "rgb(" + r + "," + g + "," + b + ")";
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};