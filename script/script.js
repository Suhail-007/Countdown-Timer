const template = document.createElement('template');
template.innerHTML = `
		<style>
		h1 {
				font-weight: bold;
				font-size: 3em;
				color: red;
		}
		
		.container {
				border-radius: 2%;
				width: 90%;
				display: grid;
				grid-template-rows: repeat(3, 1fr);
				grid-template-columns: repeat(6, 1fr);			
				grid: 0 0.5em;
				padding: 2em 0;
		}

		.hrs-div,
		.min-div,
		.sec-div {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
		}

		.hrs-div {
				grid-column: 1 / 3;
				grid-row: 1 / 2;
		}
				
		.min-div {
				grid-column: 3 / 5;
				grid-row: 1 / 2; 
		}
		
		.sec-div {
				grid-column: 5 / 7;
				grid-row: 1 / 2; 
		}
		
		.btns-div {
				grid-column: 1 / -1;
				grid-row: 3 / 4; 
		}
		
		label {
				font-size: 1.8em;
		}
		
		input {
				margin-top: 1em;
				width: 50%;
				border: none;
				outline: none;
				background: transparent;
		}
		
		input[placeholder] {
				font-size: 2.5em;
		}
		
		.btns-div {
				display: flex; 
				justify-content: center;
				align-items: center;
				gap: 0 1em;
		}
		
		button {
				font-size: 1.5em;
				border: none;
				background: none;
				cursor: pointer;
				transition: 300ms ease-in-out;
		}
		
		button:hover {
				color: white;
				text-shadow: 1px 0px 5px black;
				transform: scale(1.1);
		}
		</style>
		<div class='timer-heading'>
				<h1 class='heading'></h1>
		</div>
		<div class='container'>
				<div class='hrs-div'>
						<label for='hrs'>Hours</label>
						<input id='hrs' type='number' placeholder='00'>
				</div>
				<div class='min-div'>
						<label for='min'>Minutes</label>
						<input id='min' type='number' placeholder='00'>
				</div>
				<div class='sec-div'>
						<label for='sec'>Seconds</label>
						<input id='sec' type='number' placeholder='00'>
				</div>				
				<div class='btns-div'>
						<button id='startBtn'>Start</button>
						<button id='stopBtn'>Stop</button>
						<button id='resetBtn'>Reset</button>
				</div>
		</div>`


class TimerHeading extends HTMLElement {
		constructor() {
				super();
				this.attachShadow({ mode: 'open' });
				this.shadowRoot.appendChild(template.content.cloneNode(true));
				this.shadowRoot.querySelector('.heading').innerHTML = this.getAttribute('heading');
				this.hours = this.shadowRoot.querySelector('#hrs');
				this.minutes = this.shadowRoot.querySelector('#min');
				this.seconds = this.shadowRoot.querySelector('#sec');
				this.timer;
		}
		
		conditions() {
		if (this.hours.value != 0 && this.minutes.value == 0 && this.seconds.value == 0) {
				this.hours.value--;
				this.minutes.value = 59;
				this.seconds.value = 60;
		}
		
		if (this.minutes.value != 0 && this.seconds.value == 0) {
				this.minutes.value--;
				this.seconds.value = 60;
		}
		
		if (this.seconds.value != 0) {
				this.seconds.value--;
		}
}
		
		startTimer() {
				this.timer = setInterval(() => {
						this.conditions();
				}, 1000);	
		}
		
		connectedCallback() {
				let startBtn = this.shadowRoot.querySelector('#startBtn');
				startBtn.addEventListener('click', () => {
				if (this.hours.value != 0 || this.minutes.value != 0 || this.seconds.value != 0) {
				  this.startTimer();
			   	startBtn.disabled = true;
				}			
		});
				
				let stopBtn = this.shadowRoot.querySelector('#stopBtn');
				stopBtn.addEventListener('click', () => {
						startBtn.disabled = false;
						clearInterval(this.timer);
				});
				
				let resetBtn = this.shadowRoot.querySelector('#resetBtn');
		resetBtn.addEventListener('click', () => {
				clearInterval(this.timer);
				this.hours.value = '';
				this.minutes.value = '';
				this.seconds.value = '';
				
				if (!startBtn.disabled) return;		
		 	 else	startBtn.disabled = false;
		});
		}
		
		discountedCallback () {
		//start Button
this.shadowRoot.querySelector('#startBtn').removeEventListener();

//stop Button
this.shadowRoot.querySelector('#stopBtn').removeEventListener();

//resetButton
this.shadowRoot.querySelector('#resetBtn').removeEventListener();
		}
}

window.customElements.define('timer-heading', TimerHeading);