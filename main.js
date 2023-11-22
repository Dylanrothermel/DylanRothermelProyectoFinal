if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {

    let removerItem = document.getElementsByClassName("boton")
        for (let i = 0; i < removerItem.length; i++){
            let boton = removerItem[i]
            boton.addEventListener("click", eliminarItems)
        }

        let cantidadInputs = document.getElementsByClassName("carrito-cantidad-input")
        for(let i = 0; i < cantidadInputs.length; i++){
            let input = cantidadInputs[i]
            input.addEventListener("change", cantidadChange)
        }
    
    document.getElementsByClassName('btn-comprar')[0].addEventListener('click', botonComprar)
}

function botonComprar(){
    Swal.fire({
        icon: "success",
        title: "Gracias por su compra"
      })
    let carritoItems = document.getElementsByClassName("carrito-items")[0]
    while(carritoItems.hasChildNodes()){
        carritoItems.removeChild(carritoItems.firstChild)
    }
    actualizarCarrito()

}

function eliminarItems(event){
    let botonclicked = event.target
    botonclicked.parentElement.parentElement.remove()
    actualizarCarrito()

}

function cantidadChange(event){
    let input = event.target
    if (isNaN(input.value) || input.value <= 0){
        input.value = 1
    }
    actualizarCarrito()
}

function añadirACarritoclicked(event){
    let boton = event.target
    let item = boton.parentElement.parentElement
    let nombre = item.getElementsByClassName("card-title")[0].innerText
    let precio = item.getElementsByClassName("card-text")[0].innerText
    añadirAlCarrito(nombre, precio)
    actualizarCarrito()
    
}

const divContenido = document.getElementById("content")

async function cargarProductos(){
    const resp = await fetch("https://mocki.io/v1/94efe7ec-5bc9-42cf-b9b2-19156d5c7f26")
    const prods = await resp.json()
    mostrarProds(prods)
}

cargarProductos()

function mostrarProds(array) {
    array.forEach((elemento => {
        let div = document.createElement("div")
        div.innerHTML = `<div class="card" style="width: 400px;">
        <div class="card-body">
          <img src="${elemento.imagen}" alt="">
          <h5 class="card-title">${elemento.nombre}</h5>
          <p class="card-text">${elemento.precio}</p>
          <button class="btn btn-primary" id="${elemento.id}" type="button">Añadir al carrito</button>
        </div>
      </div>`
      divContenido.appendChild(div)
      const botonComprar = document.getElementById(`${elemento.id}`)
      botonComprar.addEventListener("click", () => añadirAlCarrito(elemento.nombre, elemento.precio))
      
    }))
}






function añadirAlCarrito(nombre, precio){
    let carritoFila = document.createElement('div')
    carritoFila.classList.add('carrito-fila')
    let carritoItems = document.getElementsByClassName('carrito-items')[0]
    let carritoItemNombres = carritoItems.getElementsByClassName('carrito-item-titulo')
    for (let i = 0; i < carritoItemNombres.length; i++) {
        if (carritoItemNombres[i].innerText == nombre) {
            Swal.fire({
                icon: "error",
                title: "Este item ya esta en el carrito"
              })
            return
        }
    }
    let carritoFilaContenido = `
        <div class="carrito-item carrito-columna">
            <span class="carrito-item-titulo">${nombre}</span>
        </div>
        <span class="carrito-precio carrito-columna">${precio}</span>
        <div class="carrito-cantidad carrito-columna">
            <input class="carrito-cantidad-input" type="number" value="1">
            <button class="boton" type="button" >Eliminar</button>
        </div>`
    carritoFila.innerHTML = carritoFilaContenido
    carritoItems.append(carritoFila)
    carritoFila.getElementsByClassName("boton")[0].addEventListener("click", eliminarItems)
    carritoFila.getElementsByClassName("carrito-cantidad-input")[0].addEventListener("change", cantidadChange)
    actualizarCarrito()
    Toastify({

        text: `${nombre} fue añadido con exito al carrito`,
    
        duration: 2000,
    
        }).showToast();
}






function actualizarCarrito(){
    let carritoItemContainer = document.getElementsByClassName('carrito-items')[0]
    let carritoFilas = carritoItemContainer.getElementsByClassName('carrito-fila')
    let total = 0
    for (let i = 0; i < carritoFilas.length; i++) {
        let carritoFila = carritoFilas[i]
        let precioDelItem = carritoFila.getElementsByClassName('carrito-precio')[0]
        let cantidadDeItems = carritoFila.getElementsByClassName('carrito-cantidad-input')[0]
        let precio = precioDelItem.innerText.replace('$', '')
        let cantidad = cantidadDeItems.value
        total = total + (precio * cantidad)
    }

    total = Math. round(total * 1e8) / 1e8
    document.getElementsByClassName('carrito-total-precio')[0].innerText = '$' + total
}






