class ResponseParser {
    constructor() {
        this.WAITTING_STATUS_LINE=0;
        this.WAITTING_STATUS_LINE_END=1;
        this.WAITTING_HEADER_NAME=2;
        this.WAITTING_HEADER_SPACE=3;
        this.WAITTING_HEADER_VALUE=4;
        this.WAITTING_HEADER_LINE_END = 5;
        this.WAITTING_HEADER_BLOCK_END = 6;
        this.WAITTING_BODY=7;

        this.current = this.WAITTING_STATUS_LINE;
        this.headerStatusLine = "";
        this.headerName="";
        this.headerValue="";
        this.headers = {};
        this.bodyParse = null;
    }

    receive(str) {
        for (let c of str) {
            this.receiveChar(str.charAt(c))
        }
    }

    receiveChar(char) {
        if (this.current === this.WAITTING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITTING_HEADER_LINE_END;
            }
            else {
                this.headerStatusLine += char;
            }
        } else if (this.current === this.WAITTING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITTING_HEADER_NAME
            }
        } else if (this.current === this.WAITTING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITTING_HEADER_SPACE;
            } else if (char === '\r') {
                this.current = this.WAITTING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParse = new TrunkedBodyParser();
                }
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITTING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITTING_HEADER_VALUE
            }
        } else if (this.current === this.WAITTING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITTING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            }
            else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITTING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITTING_HEADER_NAME
            }
        } else if (this.current === this.WAITTING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITTING_BODY;
            }
        } else if (this.current === this.WAITTING_BODY) {
            console.log(char)
        }
    }
}
module.exports = ResponseParser