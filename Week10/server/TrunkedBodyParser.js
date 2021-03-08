class TrunkedBodyParser {
    constructor() {
        this.WAITTING_LENGTH = 0;
        this.WAITTING_LENGTH_END = 1;
        this.READING_TRUNK = 2;
        this.WAITTING_NEW_LINE = 3;
        this.WAITTING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITTING_LENGTH;
    }

    receiveChar(char) {
        if (this.current === this.WAITTING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITTING_LENGTH_END;
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITTING_LENGTH_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if(this.current === this.READING_TRUNK) {
            this.content.push(char);
            this.length --;
            if (this.length === 0) {
                this.current = this.WAITTING_NEW_LINE;
            }
        } else if (this.current === this.WAITTING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITTING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITTING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITTING_LENGTH;
            }
        }
    }
}

module.exports = TrunkedBodyParser