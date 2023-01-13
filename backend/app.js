const express = require("express");
const routes = require('./routes/index.js');
const socketIO = require("socket.io");
const path = require("path");
const port = process.env.PORT || 3700;




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


        
async function main() {
    
    try {
        
        const app = await startExpress(port);
        const io = await startIO(app,port);
        
        
        // when connection established, send all data to client
        io.sockets.on('connection', function (socket) {
            console.log('A user connected');
        });


        /*
        Continues send analog data to HMI A0 to A3
        */
        setInterval(() => {
            
            sendSocket(io,"A0",parseEmit("A0",getAnalogValue()));
            sendSocket(io,"A1",parseEmit("A2",getAnalogValue()));
            sendSocket(io,"A2",parseEmit("A3",getAnalogValue()));
            sendSocket(io,"A3",parseEmit("A4",getAnalogValue()));

        }, 1000);
       
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
