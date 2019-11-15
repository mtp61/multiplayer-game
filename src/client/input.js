class InputHandler {
    constructor() {
        this.left = 0;
        this.right = 0;
        this.forward = 0;

        this.networkInterval;
    }

    onKeyDown(e) {
        switch (e.keyCode) {
            case 65: // A
                this.left = 1;
                break;
            case 87: // W
                this.forward = 1;
                break;
            case 68: // D
                this.right = 1;
                break;
        }
    }
    
    onKeyUp(e) {
        switch (e.keyCode) {
            case 65: // A
                this.left = 0;
                break;
            case 87: // W
                this.forward = 0;
                break;
            case 68: // D
                this.right = 0;
                break;
        }
    }

    getInput() {
        console.log('here');
        return [
            (this.right - this.left) * .05,
            this.forward * 1
        ];
    }
    
    startCapturingInput() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        this.networkInterval = setInterval(this.networkInput, 1000 / 60);
    }
      
    stopCapturingInput() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);

        clearInterval(this.networkInterval);
    }
}

module.exports = InputHandler;