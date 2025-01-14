// chatGPT has been used for this code.

class Button {
    constructor(color, width, height, top, left, order) {
        this.order = order;
        this.btn = document.createElement("button");
        this.btn.classList.add("memory-button");
        this.btn.style.backgroundColor = color;
        this.btn.style.width = width;
        this.btn.style.height = height;
        this.btn.style.position = "absolute";
        this.setLocation(top, left);
  
        // Initially show the number for memorization
        this.showNumber(true);
  
        // Add event listener
        this.btn.addEventListener("click", () => {
            this.onClick();
        });
  
        document.getElementById("buttons-container").appendChild(this.btn);
    }
  
    setLocation(top, left) {
        this.btn.style.top = top;
        this.btn.style.left = left;
    }
  
    showNumber(visible) {
        this.btn.textContent = visible ? this.order + 1 : "";
    }
  
    onClick() {
        console.error("onClick handler not set for button");
    }
  }
  

  class ButtonManager {
    constructor(numButtons, onClickCallback) {
        this.numButtons = numButtons;
        this.onClickCallback = onClickCallback;
        this.buttons = [];
        this.colors = ["Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink"];
    }
  
    createButtons() {
        const offsetX = 10;
        const offsetY = 10;
        const buttonSpacing = 230;
  
        for (let i = 0; i < this.numButtons; i++) {
            const color = this.colors[i % this.colors.length];
            const top = `${offsetY}px`;
            const left = `${offsetX + i * buttonSpacing}px`;
  
            const button = new Button(color, "10em", "5em", top, left, i);
            button.onClick = () => this.onClickCallback(button);
            this.buttons.push(button);
  
            // Initially disable all buttons
            button.btn.disabled = true;
        }
    }
  
    scrambleButtons() {
        const container = document.getElementById("buttons-container");
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
  
        // Hide numbers before scrambling
        this.buttons.forEach(button => button.showNumber(false));
  
        this.buttons.forEach(button => {
            const interval = setInterval(() => {
                const randomTop = Math.floor(Math.random() * (containerHeight - 100)) + "px";
                const randomLeft = Math.floor(Math.random() * (containerWidth - 200)) + "px";
                button.setLocation(randomTop, randomLeft);
            }, 2000);
  
            setTimeout(() => {
                clearInterval(interval);
                // After scrambling, enable buttons for user to click
                button.btn.disabled = false;
            }, 2000 * this.numButtons);
        });
    }
  
    revealNumbers() {
        // Reveal numbers on all buttons
        this.buttons.forEach(button => button.showNumber(true));
    }
  }
  

  class Game {
    constructor() {
        this.currentClickIndex = 0;
        this.buttonManager = null;
    }
  
    start() {
        this.currentClickIndex = 0;
        const numButtons = parseInt(document.getElementById("num-buttons").value);
  
        if (numButtons < 3 || numButtons > 7 || isNaN(numButtons)) {
            document.getElementById("message").textContent = MESSAGES.INVALID_INPUT;
            return;
        }
  
        document.getElementById("message").textContent = "";
        if (this.buttonManager) this.buttonManager.buttons.forEach(button => button.btn.remove());
  
        this.buttonManager = new ButtonManager(numButtons, button => this.handleButtonClick(button));
        this.buttonManager.createButtons();
  
        document.getElementById("message").textContent = MESSAGES.WAITING;
  
        // Allow user to memorize numbers before scrambling
        setTimeout(() => this.buttonManager.scrambleButtons(), numButtons * 2000);
    }
  
    handleButtonClick(button) {
        console.log(`Button clicked: ${button.order + 1}`);
        console.log(`Expected order: ${this.currentClickIndex + 1}`);
  
        if (button.order === this.currentClickIndex) {
            button.btn.disabled = true;
            this.currentClickIndex++;
            if (this.currentClickIndex === this.buttonManager.numButtons) {
                document.getElementById("message").textContent = MESSAGES.EXCELLENT_MEMORY;
            }
        } else {
            document.getElementById("message").textContent = MESSAGES.GAME_OVER;
  
            // Reveal numbers if user clicks wrong order
            this.buttonManager.revealNumbers();
  
            // Disable all buttons
            this.buttonManager.buttons.forEach(btn => (btn.btn.disabled = true));
        }
    }
  }
  

// run 
const game = new Game();

document.getElementById("start-button").addEventListener("click", () => {
    game.start();
});

document.getElementById("input-label").textContent = MESSAGES.INPUT_LABEL;
