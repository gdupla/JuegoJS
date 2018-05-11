var idArrastrado = "";
var jugadorActivo;

$(function () {
  var colors = ["red", "blue", "green", "yellow"];

  $(".dot").each(function () {
    var x = Math.floor((Math.random() * 4));
    $(this).data('color', colors[x]);
    $(this).css("background-color", colors[x]);
  });

  jugadorActivo = Math.ceil((Math.random() * 2));
  cambiaJugador();
});

function start(e) {
  //e.dataTransfer.setData("text/plain", e.target.id); // Coje el elemento que se va a mover
  //e.target.style.opacity = '0.4'; // Establece la opacidad del elemento que se va arrastrar

  var id = e.target.id;
  e.dataTransfer.setData("text/plain", id); // Coje el elemento que se va a mover
  e.target.style.opacity = '0.8'; // Establece la opacidad del elemento que se va arrastrar
  idArrastrado = id;

  var xSrc = $('#' + idArrastrado).data('x');
  var ySrc = $('#' + idArrastrado).data('y');
  $(".dot").each(function () {
    var xTarget = $(this).data('x');
    var yTarget = $(this).data('y');
    if ((xSrc == xTarget && (ySrc == yTarget || yTarget == ySrc - 1 || yTarget == ySrc + 1)) || (ySrc == yTarget && (xSrc == xTarget || xTarget == xSrc - 1 || xTarget == xSrc + 1))) {
      $(this).css('border', '3px dotted #000');
    } else {
      $(this).css('opacity', '0.4'); // Establece la opacidad del elemento que se va arrastrar

    }
  });
}

function end(e) {
  e.target.style.opacity = ''; // Restaura la opacidad del elemento   
  e.dataTransfer.clearData("text/plain");
  idArrastrado = "";
  $(".dot").each(function () {
    $(this).css('border', '0');
    $(this).css('opacity', '1');
  });  
}

function over(e) {
  var srcId = idArrastrado; // Elemento arrastrado
  var targetId = e.target.id; // Elemento sobre el que se arrastra

  var xSrc = $('#' + srcId).data('x');
  var ySrc = $('#' + srcId).data('y');

  var xTarget = $('#' + targetId).data('x');
  var yTarget = $('#' + targetId).data('y');

  if ((xSrc == xTarget && (ySrc == yTarget || ySrc == yTarget - 1 || ySrc == yTarget + 1)) || (ySrc == yTarget && (xSrc == xTarget || xSrc == xTarget - 1 || xSrc == xTarget + 1))) {
    //e.target.style.border = '3px dotted #555';
    return false;
  } else
    return true;

  //return false;
}

function drop(e) {
  var elementoArrastrado = e.dataTransfer.getData("text/plain"); // Elemento arrastrado
  //e.target.appendChild(document.getElementById(elementoArrastrado)); // Añade el elemento arrastrado al elemento desde el que se llama a esta funcion

  var colorSrc = $('#' + elementoArrastrado).data("color");
  var colorTarget = $('#' + e.target.id).data("color");

  $('#' + elementoArrastrado).css("background-color", colorTarget);
  $('#' + elementoArrastrado).data("color", colorTarget);
  $('#' + e.target.id).css("background-color", colorSrc);
  $('#' + e.target.id).data("color", colorSrc);

  e.target.style.border = '';   // Quita el borde del cuadro al que se mueve

  checkObjetivos();

  cambiaJugador();
}

function cambiaJugador() {
  $('#ObjetivosJugador' + jugadorActivo).css('opacity', '0.5');
  $('#jugador' + jugadorActivo).css('font-weight', '400');
  if (jugadorActivo == 1) {
    jugadorActivo = 2;
  }
  else {
    jugadorActivo = 1;
  }
  $('#ObjetivosJugador' + jugadorActivo).css('opacity', '1');
  $('#jugador' + jugadorActivo).css('font-weight', 'bold');
}

function checkObjetivos() {
  var objetivoCumplido = [];
  $(".dot").each(function () {
    var dot = $(this);
    var x = dot.data('x');
    var y = dot.data('y');
    //alert("Se comprueba el punto " + x + "-" + y);
    var colorDot = dot.data('color');
    $('.objetivo').each(function () {
      var objetivo = $(this);
      var jugadorObjetivo = objetivo.data('jugador');
      var cumplido = objetivo.data('cumplido');
      if (jugadorObjetivo == jugadorActivo && cumplido == "NO") {
        var colorObjetivo = objetivo.data('color');
        var checked = false;
        var puntosCumplen = [];
        objetivo.find('.smallDot').each(function () {
          var smallDot = $(this);
          var xCheckId = x + smallDot.data('x');
          var yCheckId = y + smallDot.data('y');
          var checkId = xCheckId + '-' + yCheckId
          var checkColor = $('#' + checkId).data('color');
          //alert("Se comprueba el punto " + checkId + " de color " + checkColor + " con el objetivo de color " + colorObjetivo);

          if (colorObjetivo == checkColor) {
            //alert("El punto " + checkId + "cumple");
            puntosCumplen.push(checkId)
          }
          else {
            checked = false;
          }
        });
        if (puntosCumplen.length == objetivo.data('puntos')) {
          var puntos = parseInt(objetivo.data('score'));
          var idMarcador = "#marcadorJugador" + jugadorActivo;
          var puntosJugadorActivo = parseInt($(idMarcador).html());
          alert("¡¡Objetivo Cumplido!!\nEl Jugador " + jugadorActivo + " gana " + puntos + " puntos");
          objetivo.data('cumplido', 'SI');
          objetivo.hide();
          $(idMarcador).html(puntosJugadorActivo + puntos);
          $.extend(objetivoCumplido, puntosCumplen);
        }
      }   
    });
  });

  for (var i = 0; i < objetivoCumplido.length; i++) {
    var id = objetivoCumplido[i];
    $('#' + id).css("background-color", "black");
    $('#' + id).data("color", "black");
  }
}