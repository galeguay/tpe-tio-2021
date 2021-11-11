"use strict"

let pedidos = []

let inputNombre = document.querySelector("#nombre");
let inputDireccion = document.querySelector("#direccion");
let inputSelect = document.querySelector("#select");
let inputCantidad = document.querySelector("#cantidad");
let inputCodigo = document.querySelector("#codigodescuento");


let tablaDinamica = document.querySelector("#tabladinamica");
let tbody = tablaDinamica.querySelector("tbody");

const url = 'https://60db1e91801dcb0017290e7d.mockapi.io/api/compra';
let ultimoid = "0";

console.table(pedidos);
obtenerDatos();



//BOTON AGRERGAR COMPRA A LA TABLA
let formulariocompra = document.querySelector("#form_pedido");
formulariocompra.addEventListener("submit", function (e) {
    e.preventDefault();

    let nuevoId = parseInt(ultimoid) + 1;

    let pedido = {
        nombre: inputNombre.value,
        direccion: inputDireccion.value,
        producto: inputSelect.value,
        cantidad: parseInt(inputCantidad.value),
        codigodescuento: inputCodigo.value,
        id: nuevoId.toString(),
    }

    agregarPedidoAPI(pedido);
});

//BOTON FILTRAR
let btn_filtrar = document.querySelector("#form_filtro");
btn_filtrar.addEventListener("submit", function (e) {
    e.preventDefault();
    let inputBuscar = document.querySelector("#filtro");
    let filtro = inputBuscar.value.toLowerCase();
    let nodosFilas = tbody.querySelectorAll("tr");

    if (filtro != "") {
        for (const tr of nodosFilas) {
            let visible = false;
            let arreglotd = tr.querySelectorAll("td");
            for (const td of arreglotd) {
                if (td.innerHTML.toLowerCase().trim() == filtro) {
                    visible = true;
                }
            }
            if (visible == true) {
                tr.style.display = "";
            } else {
                tr.style.display = "none";
            }
        }
    } else {
        for (const tr of nodosFilas) {
            tr.style.display = "";
        }
    }
});

document.querySelector("#btn_desfiltrar").addEventListener("click", function (){
    let nodosFilas = tbody.querySelectorAll("tr");
    for (const tr of nodosFilas) {
        tr.style.display = "";
    }
})



//AGREGA EL PEDIDO A LA API, AL ARREGLO Y AL LA TABLA HTML
//RECIBE POR PARAMETRO UN JSON CON LOS DATOS DEL PEDIDO
async function agregarPedidoAPI(pedido) {
    try {
        let res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        if (res.ok) {
            pedidos.push(pedido);
            ultimoid = pedidos[pedidos.length - 1].id;
            mostrarItem(pedido);
            console.table(pedidos);
        }
    } catch (error) {
        console.log(error);
    }
}



//CARGA EN LA TABLA HTML LOS ELEMENTOS QUE YA SE ENCUENTRAN E
function mostrarArreglo() { //carga en la tabla html los elementos que ya se encuentran "precargados" en el arreglo
    for (const pedido of pedidos) {
        mostrarItem(pedido);
    }
}



//BORRA EL ULTIMO ELEMENTO DEL ARREGLO Y DEL LA TABLA HTML (2DA ENTREGA ADAPTADO A LA 3RA ENTREGA)
function borrarUltimo() { //borra el ultimo elemento del arreglo y de la tabla de html
    if (pedidos.length > 0) {
        pedidos.pop();
        tbody.lastChild.remove();
        console.table(pedidos);
    }
}



//BORRA TODOS LOS ELEMENTOS DEL ARREGLO Y DE LA TABLA HTML (2DA ENTREGA)
function vaciarTabla() {
    pedidos = [];
    console.table(pedidos);
    let filasTabla = document.querySelectorAll("tr");
    for (const fila of filasTabla) {
        if (fila.parentElement.tagName != "THEAD") {
            fila.remove();
        }
    };
}



//AGREGA LA FILA A LA TABLA DE HTML 
//RECIBE POR PARAMETRO JSON CON LOS DATOS DEL PEDIDO
function mostrarItem(pedido) {
    tbody.innerHTML +=
        `<tr>
            <td> ${pedido.nombre} </td>
            <td> ${pedido.direccion} </td>
            <td> ${pedido.producto} </td>
            <td> ${pedido.cantidad} </td>
            <td> ${pedido.codigodescuento} </td>
            <td> <button class="btnEliminar" data-id="${pedido.id}"> Eliminar </button> <button class="btnEditar" data-id="${pedido.id}"> Editar </button> </td>
        </tr>`;

    let listaBtnEliminar = document.querySelectorAll(".btnEliminar");
    for (const button of listaBtnEliminar) {
        button.addEventListener("click", function () {
            let idABorrar = this.dataset.id;
            let fila = this.parentElement.parentElement;
            borrarPedidoAPI(idABorrar, fila);
        });
    }

    let listaBtnEditar = document.querySelectorAll(".btnEditar");
    for (const button of listaBtnEditar) {
        button.addEventListener("click", function () {
            let idAEditar = this.dataset.id;
            let fila = this.parentElement.parentElement;
            editarPedido(idAEditar, fila);
        })
    }

    if (pedido.cantidad >= 2 && pedido.cantidad <= 5) { //si el cantidad del objeto recibido por parametro es entre 2 y 5 cambia el fondo a amarillo
        tbody.lastChild.classList.toggle("cantidadentre2y5");
    } else if (pedido.cantidad >= 6) { //si el cantidad del objeto recibido por parametro es entre 2 y 5 cambia el fondo a verde
        tbody.lastChild.classList.toggle("cantidadmayora5");
    }
}




//LLAMA LA FUNCION editaPedidoAPI PARA EFECTUAR LOS CAMBIOS
//RECIBE POR PARAMETRO EL ID Y LA FILA DEL HTML, DEL PEDIDO
function editarPedido(id, fila) {
    let celdas = fila.querySelectorAll("td");
    
    //CARGA INPUTS CON DATOS DE LA FILA
    inputNombre.value = celdas[0].innerHTML.trim();
    inputDireccion.value = celdas[1].innerHTML.trim();
    inputSelect.value = celdas[2].innerHTML.trim();
    inputCantidad.value = celdas[3].innerHTML.trim();
    inputCodigo.value = celdas[4].innerHTML.trim();

    //OCULTA BOTON AGREGAR
    let btnAgregar = document.querySelector("#btn_agregar");
    btnAgregar.style.display = "none";

    //AGREGA Y ASIGNA FUNCIONAMIENTO A BOTONES GUARDAR Y CANCELAR
    document.querySelector("#botonesEditar").innerHTML =
        `<button id="btnGuardar"> GUARDAR </button> <button id="btnCancelar"> CANCELAR </button>`;
    document.querySelector("#btnGuardar").addEventListener("click", function () {
        let pedidoEditado = {
            nombre: inputNombre.value,
            direccion: inputDireccion.value,
            producto: inputSelect.value,
            cantidad: parseInt(inputCantidad.value),
            codigodescuento: inputCodigo.value,
            id: id,
        }
        editarPedidoAPI(pedidoEditado, celdas);
        btnAgregar.style.display = "flex";
        document.querySelector("#botonesEditar").innerHTML = "";
    });
    document.querySelector("#btnCancelar").addEventListener("click", function () {
        btnAgregar.style.display = "flex";
        document.querySelector("#botonesEditar").innerHTML = "";
        vaciarInputs();
    });
}



//RECIBE: UN JSON DEL PEDIDO CON LOS CAMPOS EDITADOS Y LA REFERENCIA A LAS CELDAS DE LA FILA DEL HTML
//EDITA LOS DATOS DEL PEDIDO EN LA API Y LUEGO EN EL ARREGLO Y HTML
async function editarPedidoAPI(pedido, celdas) {
    try {
        let res = await fetch(url + "/" + pedido.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        if (res.ok) {
            let pos = 0;

            //BUSCA LA POSICION DEL PEDIDO EN EL ARREGLO
            for (let index = 0; index < pedidos.length; index++) {
                if (pedidos[index].id == pedido.id) {
                    pos = index;
                    break;
                }
            }

            //EDITA EL PEDIDO EN EL ARREGLO
            pedidos[pos] = pedido;

            //EDITA EL PEDIDO EN EL HTML
            celdas[0].innerHTML = pedido.nombre;
            celdas[1].innerHTML = pedido.direccion;
            celdas[2].innerHTML = pedido.producto;
            celdas[3].innerHTML = pedido.cantidad;
            celdas[4].innerHTML = pedido.codigodescuento;

            //CAMBIA COLOR DE LA FILA EDITADA
            let fila = celdas[0].parentElement;
            if (pedido.cantidad == 1) {
                fila.classList.remove("cantidadentre2y5");
                fila.classList.remove("cantidadmayora5");
            } else if (pedido.cantidad >= 2 && pedido.cantidad <= 5) { //si el cantidad del objeto recibido por parametro es entre 2 y 5 cambia el fondo a amarillo
                fila.classList.remove("cantidadmayora5");
                fila.classList.toggle("cantidadentre2y5");
            } else if (pedido.cantidad >= 6) { //si el cantidad del objeto recibido por parametro es entre 2 y 5 cambia el fondo a verde
                fila.classList.remove("cantidadentre2y5");
                fila.classList.toggle("cantidadmayora5");
            }

            vaciarInputs();
            console.table(pedidos);
        }
    } catch (error) {
        console.log(error);
    }
}



//OBTIENE LOS DATOS DE LA API, LOS AGREGAR AL ARREGLO Y A LA TABLA HTML
async function obtenerDatos() {
    try {
        let res = await fetch(url);
        let json = await res.json();
        for (const pedido of json) {
            pedidos.push(pedido);
        }
        if (pedidos.length != 0) {
            ultimoid = pedidos[pedidos.length - 1].id;
            mostrarArreglo();
            console.table(pedidos);
        }
    } catch (error) {
        console.log(error);
    }
}



//RECIBE POR PARAMETRO EL ID Y LA FILA DEL HTML, DEL PEDIDO A BORRAR
//BORRA EL PEDIDO DE LA API, DEL ARREGLO Y DE LA TABLA HTML
async function borrarPedidoAPI(id, fila) { //borra de la API, del arreglo y del HTML, el pedido con el id y la fila(elemento HTML) pasados por parametro
    try {
        let res = await fetch(url + "/" + id, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            let pos = 0;
            for (let index = 0; index < pedidos.length; index++) { //busca la posición del pedido en el arreglo
                if (pedidos[index].id == id) {
                    pos = index;
                    break;
                }
            }
            pedidos.splice(pos, 1); //elimina el pedido del arreglo
            fila.remove(); //elimina la fila del HTML
            if (id == ultimoid){
                ultimoid--;
            }
            console.table(pedidos);
        }
    } catch (error) {
        console.log(error);
    }
}







//VACIA EL CONTENIDO DE LOS INPUTS
function vaciarInputs() {
    inputNombre.value = "";
    inputDireccion.value = "";
    inputSelect.value = "";
    inputCantidad.value = "";
    inputCodigo.value = "";
}



