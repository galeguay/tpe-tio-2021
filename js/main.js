"use strict";

function validarRespuesta(evento){
    evento.preventDefault(); /*evita recarga la pagina al poner enviar*/
    let espaciodelcaptcha = document.querySelector("#input-captcha");
    let respuestausuario = espaciodelcaptcha.value;
    if(respuestausuario == 10) {
        console.log("Numero correcto");
        document.querySelector("#resultadocaptcha").innerHTML = "¡Numero correcto, su mensaje fue enviado!";
    }
    else {
        console.log("Numero incorrecto, vuelva a intentar");
        document.querySelector("#resultadocaptcha").innerHTML = "Numero incorrecto, vuelva a intentar.";
    }
}

document.querySelector("#form_contacto").addEventListener("submit", validarRespuesta);