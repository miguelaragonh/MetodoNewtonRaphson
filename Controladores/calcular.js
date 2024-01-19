var condicion = true;

function run() {
  const fx = document.getElementById("fx").value.trim();
  const xi = document.getElementById("xi").value.trim();
  const xr = document.getElementById("xa").value.trim();
  const ee = document.getElementById("ee").value.trim();

  if (
    noNumeros(xi, xr, ee) == false &&
    espaciosVacios(fx, xi, xr, ee) == false &&
    esPolinomio(fx) == false
  ) {
    calcular(fx, xi, xr, ee);
  }
}

function esPolinomio(fx) {
  if (fx.trim() === "") {
    return true;
  }

  fx = fx.replace(/\s/g, "").toLowerCase();

  var regex = /^[+-]?(\d*x(\^\d+)?|[+-]?\d+)([+-](\d*x(\^\d+)?|[+-]?\d+))*$/;

  if (!regex.test(fx)) {
    document.getElementById("errfx").innerHTML =
      ' <div class="alert alert-danger" role="alert">¡La función no está escrita en su forma polinomial! </div>';
    return !regex.test(fx);
  } else {
    document.getElementById("errfx").innerHTML = " <div></div>";
    return !regex.test(fx);
  }
}

function validarNumerosDecimales(event) {
  const input = event.target;
  const valor = input.value;

  const valorSinComas = valor.replace(/,/g, ".");

  input.value = valorSinComas;
}

function espaciosVacios(fx, xi, xr, ee) {
  if (fx === "" || xi === "" || xr === "" || ee === "") {
    Swal.fire({
      text: "Existen campos vacios!",
      icon: "error",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });
    return true;
  } else {
    return false;
  }
}

function noNumeros(xi, xr, ee) {
  let bool = false;

  if (isNaN(+xi) == true) {
    document.getElementById("errxi").innerHTML =
      ' <div class="alert alert-danger" role="alert">Colocaste un dato no númerico! </div>';
    bool = true;
  } else {
    document.getElementById("errxi").innerHTML = " <div></div>";
  }
  if (isNaN(+xr) == true) {
    document.getElementById("errxa").innerHTML =
      ' <div class="alert alert-danger" role="alert">Colocaste un dato no númerico! </div>';
    bool = true;
  } else {
    document.getElementById("errxa").innerHTML = " <div></div>";
  }
  if (isNaN(+ee) == true) {
    document.getElementById("erree").innerHTML =
      ' <div class="alert alert-danger" role="alert">Colaste un dato no númerico! </div>';
    bool = true;
  } else {
    document.getElementById("erree").innerHTML = " <div></div>";
  }
  return bool;
}

function desborde() {
  Swal.fire({
    text: "Se ha excedido el limite maximo de Iteraciones!",
    icon: "error",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });
}

function solucionfx(fx, xr) {
  //recibe una funcion y un valor real de x, con los cuales evalua la funcion en el valor de x y retorna la raiz 
  return nerdamer(fx, { x: xr }).evaluate().text();
}

function derivadaFx(fx) {
  //recibe una funcion, realiza derivacion y retorna la funcion derivada en formato string
  return nerdamer("diff(" + fx + ")").text();
}

function errAbs(xr, xa) {
  //recibe el valor real de la x y una aproximacion, calcula el error absoluto y retorna el resultado en formato entero, decimal o float
  return math.abs(xa - xr);
}

function errRe(xr, xa) {
  //recibe el valor real de la x y una aproximacion, calcula el error relativo y retorna el resultado en formato entero, decimal o float
  return math.abs(xr - xa) / math.abs(xr);
}

function errEs(xa, xan) {
  //recibe el valor anterior y actual de la x, calcula el error estimado y retorna el resultado en formato entero, decimal o float
  return math.abs(xa - xan) / math.abs(xa);
}

function xActual(x, y, z) {
  //recibe el valor anterior de la x, la fx y fx' valorados en el valor de x, calcula raiz con la formula de newton-rapson y retorna el resultado en formato entero, decimal o float
  return x - y / z;
}

function graficarfx() {
  //consumiendo el metodo plot de la libreria plot realiza el grafico de cualquier funcion
  let fx2 = document.getElementById("fx2");//datos de la funcion
  console.log("Graficando: " + fx2.value);

  let grafico = document.getElementById("graficar");//contenedor donde queremos poner la grafica
  let contentsBounds = document.body.getBoundingClientRect();
  //tamono del contenedor de la grafica
  let width = 1000;
  let height = 600;
  //consumo de la funcion enviando por parametro un JSON con todos los datos necesarios para funcionar correctamente
  functionPlot({
    target: grafico,//donde quiero pintar la grafica
    width,//ancho
    height,//altura
    grid: true,//modo matrix
    data: [{ fn: fx2.value }],//datos de la funcion a graficar
  });
}

function calcular(fx, xi, xa, ee) {
  //location.reload();
  document.getElementById("calculo").disabled = true;
  let i = 0;
  let con = 0;
  let  matriz = new Array();
  
  while (1) {
 
    if (i == 0) {
      matriz.push([
        i,
        xi,
        solucionfx(fx, xi),
        solucionfx(derivadaFx(fx), xi),
        errAbs(xi, xa),
        errRe(xa, xi),
        "        ",
      ]);
      con++;
    } else {
      matriz.push([
        i,
        xActual(matriz[i - 1][1], matriz[i - 1][2], matriz[i - 1][3]),solucionfx( fx,xActual(matriz[i - 1][1], matriz[i - 1][2], matriz[i - 1][3])),
        solucionfx(derivadaFx(fx), xActual(matriz[i - 1][1], matriz[i - 1][2], matriz[i - 1][3])),
        errAbs(xa,xActual(matriz[i - 1][1], matriz[i - 1][2], matriz[i - 1][3])),
        errRe(xa,xActual(matriz[i - 1][1], matriz[i - 1][2], matriz[i - 1][3])),
        errEs( xActual(matriz[i - 1][1], matriz[i - 1][2], matriz[i - 1][3]),matriz[i - 1][1]),
      ]);
      con++;
      
      if (matriz[i][6] == ee) {
        break;
      }
      if (con == 50) {
        desborde();
        condicion = false;
        break;
      }
    }

    i++;
  }

  console.log(matriz);
  rellenarMatriz(matriz);
}

function rellenarMatriz(matriz) {
  const table = document.getElementById("table");

  matriz.forEach((rowData, rowIndex) => {
    const row = document.createElement("tr");

    for (let i = 0; i < rowData.length; i++) {
      const cell = document.createElement("td");
      cell.textContent = rowData[i];
      row.appendChild(cell);
    }

    table.appendChild(row);

    if (rowIndex === matriz.length - 1 && condicion === true) {
      row.classList.add("resaltada");
    }
  });
}

function deleteMatriz(matriz) {
  const table = document.getElementById("table");

  matriz.forEach((rowData, rowIndex) => {
    const row = document.createElement("tr");

    for (let i = 0; i < rowData.length; i++) {
      const cell = document.createElement("td");
      cell.textContent = rowData[i];
      row.deleteCell(cell);
    }

    table.deleteCell(row);

    if (rowIndex === matriz.length - 1 && condicion === true) {
      row.classList.add("resaltada");
    }
  });
}

function validarFuncion(x) {
  try {
    math.evaluate(x);
    return true;
  } catch (error) {
    return false;
  }
}

function reiniciar() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esto restablecerá los campos del formulario",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, reiniciar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
      Swal.fire({
        text: "¡Campos reiniciados!",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}
