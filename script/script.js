const template = document.createElement('template');
template.innerHTML = `
		<style>
		h1 {
				font-weight: bold;
				font-size: 3em;
				color: red;
		}
		
		.container {
				width: 90%;
				max-width: 500px;
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
  #startBtn;
  #stopBtn;
  #resetBtn
  #hours;
  #minutes;
  #secs;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.shadowRoot.querySelector('.heading').innerHTML = this.getAttribute('heading');

    this.#initVariables();
    this.timer;
  }

  #initVariables() {
    this.#startBtn = this.shadowRoot.querySelector('#startBtn');
    this.#stopBtn = this.shadowRoot.querySelector('#stopBtn');
    this.#resetBtn = this.shadowRoot.querySelector('#resetBtn');
    this.#hours = this.shadowRoot.querySelector('#hrs');
    this.#minutes = this.shadowRoot.querySelector('#min');
    this.#secs = this.shadowRoot.querySelector('#sec');
  }

  #conditions() {
    //this will change the values to default value for everything
    if (this.#hours.value == 0 && this.#minutes.value == 0 && this.#secs.value == 0) {
      this.#defaultCondition();
      this.#enableInputs();
    }

    if (this.#hours.value != 0 && this.#minutes.value == 0 && this.#secs.value == 0) {
      this.#hours.value--;
      this.#minutes.value = 59;
      this.#secs.value = 60;
    }

    if (this.#minutes.value != 0 && this.#secs.value == 0) {
      this.#minutes.value--;
      this.#secs.value = 60;
    }

    if (this.#secs.value != 0) {
      this.#secs.value--;
    }
  }

  #startTimer() {
    this.timer = setInterval(() => {
      this.#conditions();
    }, 1000);
  }

  #defaultCondition() {
    this.#hours.value = '';
    this.#minutes.value = '';
    this.#secs.value = '';
    clearInterval(this.timer);

    if (!this.#startBtn.disabled) return;
    else this.#startBtn.disabled = false;
  }

  connectedCallback() {
    this.#startBtn.addEventListener('click', () => {
      if (this.#hours.value != 0 || this.#minutes.value != 0 || this.#secs.value != 0) {
        this.#startTimer();
        this.#startBtn.disabled = true;
        //disable inputs as soon as countdown starts
        this.#disableInputs();
      }
    });

    this.#stopBtn.addEventListener('click', () => {
      this.#startBtn.disabled = false;
      clearInterval(this.timer);
      this.#enableInputs();
    });

    this.#resetBtn.addEventListener('click', () => {
      clearInterval(this.timer);
      this.#defaultCondition();
      this.#enableInputs();
    });
  }

  #discountedCallback() {
    //start Button
    this.#startBtn.removeEventListener();

    //stop Button
    this.#stopBtn.removeEventListener();

    //resetButton
    this.#resetBtn.removeEventListener();
  }

  #disableInputs() {
    this.#hours.disabled = true;
    this.#minutes.disabled = true;
    this.#secs.disabled = true;
  }

  #enableInputs() {
    this.#hours.disabled = false;
    this.#minutes.disabled = false;
    this.#secs.disabled = false;
  }
}

window.customElements.define('timer-heading', TimerHeading);