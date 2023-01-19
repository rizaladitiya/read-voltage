const express = require("express");
const routes = require('./routes/index.js');
const socketIO = require("socket.io");
const path = require("path");
const port = process.env.PORT || 3700;
const range = {
    oldMin: 0,
    oldMax: 1023,
    newMin: 0,
    newMax: 5
}
var [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15] = [];
var [D0, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15] = [];



async function startExpress(port){

      	const app = express();
      	app.use('/public', express.static(process.cwd() + '/public'));
      	app.use(express.json());
      	app.use(express.urlencoded({
        	extended: true
      	}));
      	app.set('view engine', 'ejs');


    	app.get("/", (req, res) => {
            /*
  			res.status(200).send({
    			success: true,
    			message: "welcome to the beginning of greatness",
  			});
            */
            res.render('index', {
                
            });
		});
	
    	
    	app.get('/setting', async function(req, res) {
        	
        	
        	res.render('setting', {
            	
        	});
    	});
    	
    	app.post('/setting', async function(req, res) {
        	
        	
        	
    	});

      return app;
}

async function startIO(app,port){
    let io = socketIO(app.listen(port));
    
    console.log("Listening on port " + port);
    console.log("visit http://localhost:" + port);

    return io;
}

async function sendSocket(io,title,data){
        await io.emit(title, {
            data: data
        });
}
function getAnalogValue(){
        let value = ((Math.random() + 0.5) * 2);
        return value;
}
function parseEmit(message,value){
    let text = 
        {
            success: true,
            message: message,
            value: value,
          }
    ;
    return text;
}

function scaling(range,value) {
    newvalue = (range.newMax-range.newMin)/(range.oldMax-range.oldMin)*(value-range.oldMax)+range.newMax;
    return newvalue;
}
        
async function main() {
    
    try {
        
        const app = await startExpress(port);
        const io = await startIO(app,port);
        let five = require("johnny-five");
        let board = new five.Board();
        
        
        /* tes koneksi ke arduino blinking led
        board.on("ready",() => {
            let led = new five.Led(13);
            led.blink(500);
        });
        */

        board.on("ready", () => {
            
            /*
            let A0 = new five.Sensor("A0");
            let A1 = new five.Sensor("A1");
            let A2 = new five.Sensor("A2");
            let A3 = new five.Sensor("A3");
            */
           
            A0 = new five.Sensor("A0");
            A1 = new five.Sensor("A1");
            A2 = new five.Sensor("A2");
            A3 = new five.Sensor("A3");
            A4 = new five.Sensor("A4");
            /*
            A5 = new five.Sensor("A5");
            A6 = new five.Sensor("A6");
            A7 = new five.Sensor("A7");
            A8 = new five.Sensor("A8");
            A9 = new five.Sensor("A9");
            A10 = new five.Sensor("A10");
            A11 = new five.Sensor("A11");
            A12 = new five.Sensor("A12");
            A13 = new five.Sensor("A13");
            A14 = new five.Sensor("A14");
            A15 = new five.Sensor("A15");
            */
            /* 
            // metode on change untuk data lebih akurat
            A0.on("change", () => {
                
                
                let voltage = scaling(range,A0.value);
                sendSocket(io,"A0",parseEmit("A0",voltage));
                console.log(voltage);
            });
            
            A1.on("change", () => {
                let voltage = scaling(range,A1.value);
                sendSocket(io,"A1",parseEmit("A1",voltage));
            });

            A2.on("change", () => {
                let voltage = scaling(range,A2.value);
                sendSocket(io,"A2",parseEmit("A2",voltage));
            });

            A3.on("change", () => {
                let voltage = scaling(range,A3.value);
                sendSocket(io,"A3",parseEmit("A3",voltage));
            });
            */

            //metode delay, karena pakai metode on change terlalu cepat
            setInterval(()=> {
                sendSocket(io,"A0",parseEmit("A0",scaling(range,A0.value)));
                sendSocket(io,"A1",parseEmit("A1",scaling(range,A1.value)));
                sendSocket(io,"A2",parseEmit("A2",scaling(range,A2.value)));
                sendSocket(io,"A3",parseEmit("A3",scaling(range,A3.value)));
                sendSocket(io,"A4",parseEmit("A4",scaling(range,A4.value)));
                //console.log(A0.value);
             }
             ,500);
            

        });
        
        // when connection established, send all data to client
        io.sockets.on('connection', function (socket) {
            console.log('A user connected');
        });


        
       
       // detect CTRL+C and close
       let running = true;
       process.on("SIGINT", async () => {
           if (!running) {
               return; // avoid calling shutdown twice
           }
           console.log("shutting down client");
           running = false;
           
           
            
           
           //await tunnel.close();
           console.log("Done");
           process.exit();

       });
    
    }
    catch (err) {
        console.log("Error !!!", err);
        process.exit();
    }
}





main();
