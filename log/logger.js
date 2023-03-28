const log4js = require("log4js");

log4js.configure(
    {
        appenders:{
            //definir salidas de datos =>mostrar/guardar los mensajes
            consola:{type:"console"},
            archivoError:{type:"file", filename:"./log/error.log"},
            archivoWarn:{type:"file", filename:"./log/warn.log"},
            //definir salidas con niveles
            loggerConsola: {type:"logLevelFilter", appender:'consola', level:'info'},
            loggerErrores: {type:"logLevelFilter", appender:'archivoError', level:'error'},
            loggerDebug:   {type:"logLevelFilter", appender:'archivoWarn', level:'warn'},
        },
        categories:{
            default:{appenders:["loggerConsola","loggerErrores","loggerDebug"], level:'info'},
        }
    }
);

let logger=null;
logger = log4js.getLogger();

module.exports = {logger};