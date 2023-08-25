// ferreteria online consta de los siguientes funcionamientos

//  agregar productos al carrito.
//  mostrar productos de forma dinamica
//  mostrar el carrito en el html
//  eliminar productos del carrito
//  calcular el total de la compra
//  vaciar el carrito de compras
//  almacenar carrito en el local sotarage
//  ver la factura de los productos en el carrito
//  evitar la carga de productos repetidos en el carrito
//  crear alerta de mensaje al momento de finalizar compra e imprimir factura
//  eliminar todos los datos del carrito al momento de imprimir factura

class Producto{
    constructor(id,nombre,precio,img){
        this.id=id;
        this.nombre=nombre;
        this.precio=precio;
        this.img=img;
        this.cantidad=1;
    }
}

const alicate = new Producto(1,'alicate',20,'img/alicate.png');
const destornillador = new Producto(2,'destornillador',50,'img/destornillador.png');
const serrucho = new Producto(3,'serrucho',80,'img/serrucho.png');
const martillo = new Producto(4,'martillo',150,'img/martillo.png');
const taladro = new Producto(5,'taladro',200,'img/taladro.png');
const clavos= new Producto(6,'clavos',30,'img/clavos.png');
const pulidora = new Producto(7,'pulidora',70,'img/pulidora.png');
const llaves = new Producto(8,'llaves',120,'img/llaves.png');

//creamos array con todo nuestro catalogo de productos

const productos= [alicate,destornillador,serrucho,martillo,taladro,clavos,pulidora,llaves]

// creamos el array de carrito
let carrito = [];

// cargar carrito al local storage
if(localStorage.getItem("carrito")){
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

//Modificamos el Dom mostrando los productos;
const contenedorProductos = document.getElementById('contenedorProductos');

//Creamos una funcion para mostrar los productos en stock
const mostrarProductos = ()=>{
    productos.forEach( producto =>{
        const card =document.createElement('div')
        //claslist para ver las clases en el elemento con esto le pasamos 3  clases
        card.classList.add('col-xl-3', 'col-md-6', 'col-sm-12');
        card.innerHTML = `
        <div class="card">
            <img src="${producto.img}" class="card-img-tom imgProductos" alt="">
            <div class="card-body">
                <h2>${producto.nombre}</h2>
                <p>${producto.precio}</p>
                <button class="btn colorBoton" id="boton${producto.id}">Agregar al Carrito</button>
            </div>  
        </div> `
        contenedorProductos.appendChild(card)
        
        //agregar productos al carrito
        const boton =document.getElementById(`boton${producto.id}`)
        boton.addEventListener("click",()=>{
            agregarAlCarrito(producto.id);
        })
    })
}
mostrarProductos();

//creamos la funcion agregar al carrito
const agregarAlCarrito = (id)=>{
    const productoEnCarrito = carrito.find(producto=>producto.id===id);
    if(productoEnCarrito){
        productoEnCarrito.cantidad++;
    }else{
        const producto = productos.find(producto => producto.id===id);
        carrito.push(producto);
    }
    calcularTotal();

    //trabajamos con el localstorage
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

//mostrar el carrito de compras
const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click",()=>{
    mostrarCarrito();
})

const mostrarCarrito = () =>{
    contenedorCarrito.innerHTML = "";
    carrito.forEach(producto =>{
        const card =document.createElement('div')
        //claslist para ver las clases en el elemento con esto le pasamos 3  clases
        card.classList.add('col-xl-3', 'col-md-6', 'col-sm-12');
        card.innerHTML = `
            <div class="card">
                <img src="${producto.img}" class="card-img-tom imgProductos" alt="">
                <div class="card-body">
                    <h2>${producto.nombre}</h2>
                    <p>${producto.precio}</p>
                    <p>${producto.cantidad}</p>
                    <button class="btn colorBoton" id="eliminar${producto.id}" >Eliminar</button>
                </div>  
            </div> `
        contenedorCarrito.appendChild(card)

        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", ()=>{
            eliminarDelCarrito(producto.id);
        })
    })
    calcularTotal();
}

// funcion que elimina el producto del carrito
const eliminarDelCarrito = (id)=>{
    const producto=carrito.find(producto=>producto.id===id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice,1);
    mostrarCarrito();

    //localsotrate
    localStorage.setItem('carrito',JSON.stringify(carrito));
}

//vaciamos todo el carrito de compras.
const vaciarCarrito = document.getElementById("vaciarCarrito");
    vaciarCarrito.addEventListener("click", ()=>{
    eliminarTodoElCarrito();

    //localstorage
    localStorage.setItem('carrito',JSON.stringify(carrito));
})
const eliminarTodoElCarrito = ()=>{
    carrito=[];
    mostrarCarrito();
}


// mostrar el mensaje de monto total
const total = document.getElementById('total');
const calcularTotal = ()=>{
    let totalCompra = 0;
    carrito.forEach(producto =>{
        totalCompra +=producto.precio * producto.cantidad
    })
    total.innerHTML= `total ${totalCompra}`
}

// mostrar factura de los productos seleccionados
verFacturaBtn = document.getElementById("verFactura");
verFacturaBtn.addEventListener("click", () => {
    mostrarFactura();
});


// añadimos promesa para imprimir factura
const imprimirFactura = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            Swal.fire({
                title: "Factura impresa",
                text: "La factura se ha impreso correctamente.",
                icon: "success",
            }).then(() => {
                // eliminamos el contenido de la factura cuando salgamos del mensaje de alerta
                const factura = document.getElementById("factura");
                factura.innerHTML = "";

                resolve();
            });
        }, 1000); // espera 1 seg para mostrar la alerta
    });
};

// mostramos la factura con todos los productos del carrito
const mostrarFactura = () => {
    const factura = document.getElementById("factura");
    factura.innerHTML = ""; // Limpia el contenido actual de la factura

    carrito.forEach(producto => {
        const itemFactura = document.createElement("div");
        itemFactura.classList.add("factura-item");
        itemFactura.innerHTML = `
            <p width= 300 px>${producto.nombre}</p>
            <p>${producto.cantidad}</p>
            <p>$${producto.precio * producto.cantidad}</p>
        `;
        factura.appendChild(itemFactura);
    });

    const totalFactura = document.createElement("div");
    totalFactura.classList.add("factura-total");
    totalFactura.textContent = `Total: $${calcularTotalCompra()} `;
    factura.appendChild(totalFactura);

    // creamos un boton para imprimir factura el cual mandara alerta de impresion correcta
    const btnImprimirFactura = document.createElement("button");
    btnImprimirFactura.textContent = "Imprimir Factura";
    btnImprimirFactura.classList.add("btn", "colorBoton");
    btnImprimirFactura.addEventListener("click", () => {
        imprimirFactura().then(() => {
            eliminarTodoElCarrito();
        });
    });
    factura.appendChild(btnImprimirFactura);
};

//calculamos total para la seccion factura
const calcularTotalCompra = () => {
    let totalCompra = 0;
    carrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    });
    return totalCompra;
};

// finalizar la compra y mostrar mensaje de alerta
const finalizarCompra = document.getElementById("finalizarCompra")
finalizarCompra.addEventListener("click", () => {
    mostrarFactura();
    eliminarTodoElCarrito();
    Swal.fire("Gracias por su compra :) \n a continuacion se mostrara su factura ")
});