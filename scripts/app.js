// Variables globales
let carrito = []; //lista de productos

async function obtenerProductos() {
  try {
    const respuesta = await fetch("../data/products.json");
    if (!respuesta.ok) {
      throw new Error(
        `Error al obtener los productos: Codigo: ${respuesta.status}`
      );
    }
    const productos = await respuesta.json();
    renderizarProductos(productos.productos);
  } catch (error) {
    console.error(`Hubo un problema con la solicitud fetch:`, error);
  }
}

function renderizarProductos(productos) {
  const contenedorProductos = document.getElementById("productos-container");
  contenedorProductos.className = "row justify-content-center g-2";

  productos.forEach((producto) => {
    // Crear un div para cada producto con las clases de Bootstrap
    const divProducto = document.createElement("div");
    divProducto.className =
      "card card-blanco col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3";

    // Contenido HTML del producto
    divProducto.innerHTML = `
        <img src="${producto.imagen}" class="card-img-top card-img" alt="${
      producto.nombre
    }">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-truncate">${
                      producto.nombre
                    }</h6> <!-- Ajustar el tamaño del título -->
                    <p class="card-text mb-1"><strong>Precio:</strong> $${producto.precio.toFixed(
                      2
                    )}</p>
                    <div class="mt-auto">
                        <button class="btn btn-sm btn-primary w-100" onclick="agregarAlCarrito('${
                          producto.nombre
                        }', ${
      producto.precio
    })">Añadir</button> <!-- Botón más pequeño -->
                    </div>
                </div>
            </div>
        `;

    // Añadir el producto al contenedor
    contenedorProductos.appendChild(divProducto);
  });
}

//funcion que agregue productos al carrito
function agregarAlCarrito(nombre, precio) {
  const productoEnCarrito = carrito.find(
    (producto) => producto.nombre === nombre
  );

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  guardarCarritoEnLocalStorage();
  actualizarContenidoCarrito();
}
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function obtenerCarritoDelLocalStorage() {
  const carritoGuardado = localStorage.getItem("carrito");
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function actualizarContenidoCarrito() {
  const carritoBody = document.getElementById("carrito-body");
  carritoBody.innerHTML = " ";

  carrito = obtenerCarritoDelLocalStorage();

  carrito.forEach((producto) => {
    const filaProducto = document.createElement("tr");
    filaProducto.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.precio.toFixed(2)}</td>
        <td>${(producto.precio * producto.cantidad).toFixed(2)}</td>
        <td>
                <button class="btn btn-link text-danger" onclick="eliminarProducto('${
                  producto.nombre
                }')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
    carritoBody.appendChild(filaProducto);
  });
  actualizarTotalGeneralPrecios();
}

function actualizarTotalGeneralPrecios() {
  const totalPrecios = carrito.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
  );
  const totalCarrito = document.getElementById("total-carrito");
  totalCarrito.textContent = `$${totalPrecios.toFixed(2)}`;
}

function eliminarProducto(nombre) {
  // Filtrar el carrito para eliminar el producto con el nombre especificado
  carrito = carrito.filter((producto) => producto.nombre !== nombre);

  // Actualizar el localStorage y el carrito en la vista
  guardarCarritoEnLocalStorage();
  actualizarContenidoCarrito();
}

function realizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Carrito vacío",
      text: "No tienes productos en el carrito para realizar la compra.",
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "¡Compra realizada!",
      text: "Felicitaciones, tu compra ha sido exitosa.",
      showConfirmButton: true,
    }).then(() => {
      // Limpiar el carrito después de la compra
      carrito = [];
      guardarCarritoEnLocalStorage();
      actualizarContenidoCarrito();
    });
  }
}

document
  .querySelector(`#miModal .modal-footer .btn-success`)
  .addEventListener(`click`, realizarCompra);

carrito = obtenerCarritoDelLocalStorage();

obtenerProductos();
actualizarContenidoCarrito();

// Función para filtrar productos según la búsqueda
function filtrarProductos() {
  const filtro = document.getElementById("buscador").value.toLowerCase();
  const productos = document
    .getElementById("productos-container")
    .getElementsByClassName("card");

  Array.from(productos).forEach((producto) => {
    const nombreProducto = producto
      .querySelector(".card-title")
      .textContent.toLowerCase();
    producto.style.display = nombreProducto.includes(filtro) ? "block" : "none";
  });
}
