const {createLogger, format, transports} = require('winston');
const expressWinston = require('express-winston');
const express = require('express');
const morgan = require('morgan');
const { level } = require('winston');
const config = require('config');
const winston = require('winston/lib/winston/config');

const app = express();
const port = 3000;

const {combine, splat, timestamp, printf} = format;

const myFormat = printf(({level, message, timestamp, ...metadata})=>{let msg = `${timestamp} [${level}]: ${message}`; 
    if (metadata){msg +=JSON.stringify(metadata)}
        return msg;
    });

    const logger = createLogger({
        level:'debug',
        format: combine(format.colorize(), splat(), timestamp(), myFormat),
        transports: [new transports.Console({level:'info'}), new transports.File({filename: 'app.log',level:'debug'}),]
    });

// app.use(expressWinston.logger({
//     transports: [new winston.transports.Console()],
//     format: winston.format.combine(winston.format.colorize(), winston.format.json()),
//     meta: true,
//     message: "Eugene",
//     expressFormat: true,
//     ignoreRoute: function(req, res){return false;}
// }));

// const logger = winston.createLogger({
//     exitOnError: false,
//     level:'info',
//     transports:[new(winston.transports.Console)(), new(winston.transports.File)({
//         filename: 'app.log'
//     })]
// });

const myStream = {write:(text)=>{
    logger.info(text)
}}
app.use(morgan('combined', {stream: myStream}));

app.get('/', (req, res)=>{
    res.send("Introduction to Logging in NodeJs")
});

app.listen(port, ()=>{
    console.log(`Server is listening at http://localhost ${port}` );
});


const logger = winston.createLogger({
    transports:{winston,transports.File({
        filename:"error.log", level:"error",
        format: winston.format.json()
    }),
    new transports.Http({level: 'warn', format: winston.format.json()}),
    new transports.Console();
}
});