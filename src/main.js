/*
  UC:   Computação Gráfica
  Efólio : B
  Autor: Carlos Inácio
  Número Aluno Universidade Aberta : 1701879
  Curso: Licenciatura em Engenharia Informática
*/

import {bezier3} from '../bezier3.mjs';
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js';


var scene, camera, renderer, cube, controls, mouse, raycaster;
let t;
let coord0;
let coord1;
let coord2;
let coord3;
let points = [];
let pointsC1 = [];
let pointsC2 = [];
let pointsC3 = [];
let c0, c1,c2,c3;

function init(){
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight , 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);                          //Definir o ratio dos pixel no renderer
  
  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  const square = new THREE.BoxGeometry(1,1,0);
  const plane = new THREE.Group();

  createEixos(); //criar eixo positivo de x e y com cores solicitadas

  //criar plano para conseguir colocar alternar as cores 
  for(let x =-10; x<10; x++){
    for(let z=-10; z<10; z++){
        let cube;
        const lightsquare = new THREE.MeshBasicMaterial({color:0xFF8F00, transparent: true, opacity: 0.75});
        const darksquare = new THREE.MeshBasicMaterial({color: 0xB253B5, transparent: true, opacity: 0.75});
        if(z % 2 ==0){
          cube = new THREE.Mesh(square, x % 2 == 0 ? lightsquare : darksquare);
        }else{
          cube = new THREE.Mesh(square, x % 2 == 0 ? darksquare : lightsquare);
        }
        cube.position.set(x,z,0);
        plane.add(cube);
    }
  }
  scene.add(plane); //adiciona o plano à scene
	
//esfera C0
  const geometry0 = new THREE.SphereGeometry( 0.5, 32, 16 );
  const material0 = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent: true, opacity: 0.75 } );
  const sphereC0 = new THREE.Mesh( geometry0, material0 );
  sphereC0.position.set(-1,0,0.5);
  scene.add(sphereC0);

//esfera C1
  const geometry1 = new THREE.SphereGeometry( 0.5, 32, 16 );
  const material1 = new THREE.MeshBasicMaterial( { color: 0xFF0000, transparent: true, opacity: 0.75 } );
  const sphereC1 = new THREE.Mesh( geometry1, material1 );
  sphereC1.position.set(0,0,0.5);
  scene.add(sphereC1);

//esfera C2
  const geometry2 = new THREE.SphereGeometry( 0.5, 32, 16 );
  const material2 = new THREE.MeshBasicMaterial( { color: 0x13FF00, transparent: true, opacity: 0.75 } );
  const sphereC2 = new THREE.Mesh( geometry2, material2 );
  sphereC2.position.set(-1,-1,0.5);
  scene.add(sphereC2);

//esfera C3
  const geometry3 = new THREE.SphereGeometry( 0.5, 32, 16 );
  const material3 = new THREE.MeshBasicMaterial( { color: 0x0008FF, transparent: true, opacity: 0.75 } );
  const sphereC3 = new THREE.Mesh( geometry3, material3 );
  sphereC3.position.set(0,-1,0.5);
  scene.add(sphereC3);

//Linha para C0
  points.push(new THREE.Vector3(-1,0,0));
  points.push(new THREE.Vector3(scene.children[4].position.x,scene.children[4].position.y,scene.children[4].position.z));
  const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  let LineGEOM = new THREE.BufferGeometry().setFromPoints(points);
  const lineC0 = new THREE.Line(LineGEOM, material)
  scene.add(lineC0); // adicionar linha de coord a coord 2

//Linha para C1
  pointsC1.push(new THREE.Vector3(0,0,0));
  pointsC1.push(new THREE.Vector3(scene.children[5].position.x,scene.children[5].position.y,scene.children[5].position.z));
  const materialLC1 = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
  let LineGEOMLC1 = new THREE.BufferGeometry().setFromPoints(pointsC1);
  const lineC1 = new THREE.Line(LineGEOMLC1, materialLC1)
  scene.add(lineC1); // adicionar linha de coord a coord 2

//Linha para C2
  pointsC2.push(new THREE.Vector3(-1,-1,0));
  pointsC2.push(new THREE.Vector3(scene.children[6].position.x,scene.children[6].position.y,scene.children[6].position.z));
  const materialLC2 = new THREE.MeshBasicMaterial( {color: 0x13FF00} );
  let LineGEOMLC2 = new THREE.BufferGeometry().setFromPoints(pointsC2);
  const lineC2 = new THREE.Line(LineGEOMLC2, materialLC2)
  scene.add(lineC2); // adicionar linha de coord a coord 2

//Linha para C3
  pointsC3.push(new THREE.Vector3(0,-1,0));
  pointsC3.push(new THREE.Vector3(
                scene.children[7].position.x,
                scene.children[7].position.y,
                scene.children[7].position.z));
  const materialLC3 = new THREE.MeshBasicMaterial( {color: 0x0008FF} );
  let LineGEOMLC3 = new THREE.BufferGeometry().setFromPoints(pointsC3);
  const lineC3 = new THREE.Line(LineGEOMLC3, materialLC3)
  scene.add(lineC3); // adicionar linha de coord a coord 2
  

  var light = new THREE.AmbientLight(0xffffff,0.5);
  scene.add(light);
  var light2 = new THREE.AmbientLight(0xffffff,0.5);
  scene.add(light2);
  
  camera.position.z = 15; //posiciona a uma distância de 15
  camera.lookAt(-0.5,-0.5,0); //posiciona a câmara na posição 0,0,0
  
  controls = new OrbitControls(camera, renderer.domElement); //ativa o modo OrbitControls
  
  controls.enablePan = false; // evita o deslizar para fora do plano , bloqueando o utilizador para ficar a visualizar apenas o plano
  
  window.requestAnimationFrame(animate);
}

//função para criar eixo x e y positivos
function createEixos(){
  const eixoMaterialX = new THREE.LineBasicMaterial(                               //Propriedades dos eixos
      {
          color: 0x020c4f4,
          linewidth: 2
      }
  );
  const eixoMaterialY = new THREE.LineBasicMaterial(                               //Propriedades dos eixos
    {
        color: 0xf45020,
        linewidth: 2
    }
  );
  const eixoMaterialZ = new THREE.LineBasicMaterial(                               //Propriedades dos eixos
    {
        color: 0x0008FF,
        linewidth: 2
    }
  );
  const eixoPontosX = [];                                                                                     //Pontos dos eixos
  const eixoPontosY = [];
  const eixoPontosZ = [];
                                                                                     //x e y
  eixoPontosY.push( new THREE.Vector3(-0.5, 9.5,0.1));   //Cria Ponto Limite superior de Y
  eixoPontosY.push( new THREE.Vector3(-0.5, -0.5,0.1));   //cria ponto limite inferior de Y
  eixoPontosX.push( new THREE.Vector3(9.5, -0.5,0.1));   //Cria Ponto Limite Inferior de X
  eixoPontosX.push( new THREE.Vector3(-0.5, -0.5,0.1));   //Cria Ponto Limite Superior de X
  eixoPontosZ.push( new THREE.Vector3(-0.5, -0.5,10));   //Cria Ponto Limite superior de Y
  eixoPontosZ.push( new THREE.Vector3(-0.5, -0.5,0.1));   //cria ponto limite inferior de Y

  const eixoGeometriaX = new THREE.BufferGeometry().setFromPoints(eixoPontosX);                               //Geometria dos Eixos
  const eixoGeometriaY = new THREE.BufferGeometry().setFromPoints(eixoPontosY);                               //Geometria dos Eixos
  const eixoGeometriaZ = new THREE.BufferGeometry().setFromPoints(eixoPontosZ);   
  const eixoX = new THREE.Line(eixoGeometriaX, eixoMaterialX);                                                 //Cria Eixos 
  const eixoY = new THREE.Line(eixoGeometriaY, eixoMaterialY);                                                 //x e y
  const eixoZ = new THREE.Line(eixoGeometriaZ, eixoMaterialZ);

  eixoX.name="Eixo X";
  eixoY.name="Eixo Y";
  eixoZ.name="Eixo Z";

  scene.add(eixoX);                                                                                            //Adiciona na scene os eixos
  scene.add(eixoY);
  scene.add(eixoZ);
}

function animate(){
  controls.update();
  renderer.render(scene, camera);  
  window.requestAnimationFrame(animate);
}
//funçao para reajustar tamanho da janela 
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//Função para aceitar os eventos do rato para desenhar
window.addEventListener( 'mousemove', onMouseMove, false );
function onMouseMove( event ) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;                                        //Obter coordenada x clicada com o rato
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;                                     //Obter coordenada y clicada com o rato
}
//Função para preencher Formulario quando esferas são selecionados
function CaixaTexto(esfera){
  
  if(esfera === scene.children[4]){
    document.getElementById("name").value = "Esfera C0";
    document.getElementById("x").value = scene.children[4].position.x;
    document.getElementById("y").value = scene.children[4].position.y;
    document.getElementById("z").value = scene.children[4].position.z;
  }
  if(esfera === scene.children[5]){
    document.getElementById("name").value = "Esfera C1";
    document.getElementById("x").value = scene.children[5].position.x;
    document.getElementById("y").value = scene.children[5].position.y;
    document.getElementById("z").value = scene.children[5].position.z;
  }
  if(esfera === scene.children[6]){
    document.getElementById("name").value = "Esfera C2";
    document.getElementById("x").value = scene.children[6].position.x;
    document.getElementById("y").value = scene.children[6].position.y;
    document.getElementById("z").value = scene.children[6].position.z;
  }
  if(esfera === scene.children[7]){
    document.getElementById("name").value = "Esfera C3";
    document.getElementById("x").value = scene.children[7].position.x;
    document.getElementById("y").value = scene.children[7].position.y;
    document.getElementById("z").value = scene.children[7].position.z;
  }                                           
  
}

//Função para selecionar esfera C0
function selectC0(){
  if(scene.children[4].material.transparent == true){
    scene.children[4].material.transparent = false;
    scene.children[5].material.transparent = true;
    scene.children[6].material.transparent = true;
    scene.children[7].material.transparent = true;   
	
  }else{
    scene.children[4].material.transparent = true;
    document.getElementById("name").value = "";
    document.getElementById("x").value = "";
    document.getElementById("y").value = "";
    document.getElementById("z").value = "";
  }

}

//Função para selecionar esfera C1
function selectC1(){
  if(scene.children[5].material.transparent == true){
    scene.children[4].material.transparent = true;
    scene.children[5].material.transparent = false;
    scene.children[6].material.transparent = true;
    scene.children[7].material.transparent = true;
	
  }else{
    scene.children[5].material.transparent = true;
    document.getElementById("name").value = "";
    document.getElementById("x").value = "";
    document.getElementById("y").value = "";
    document.getElementById("z").value = "";
  }
  
}

//Função para selecionar esfera C2
function selectC2(){
  if(scene.children[6].material.transparent == true){
    scene.children[4].material.transparent = true;
    scene.children[5].material.transparent = true;
    scene.children[6].material.transparent = false;
    scene.children[7].material.transparent = true;
    
    console.log('dados C2 : ', scene.children[6]);
  }else{
    scene.children[6].material.transparent = true;
    document.getElementById("name").value = "";
      document.getElementById("x").value = "";
      document.getElementById("y").value = "";
      document.getElementById("z").value = "";
  }
  
}

//Função para selecionar esfera C3
function selectC3(){
  if(scene.children[7].material.transparent == true){
    scene.children[4].material.transparent = true;
    scene.children[5].material.transparent = true;
    scene.children[6].material.transparent = true;
    scene.children[7].material.transparent = false;
    
    console.log('dados C3 : ', scene.children[7]);
  }else{
    scene.children[7].material.transparent = true;
    document.getElementById("name").value = "";
      document.getElementById("x").value = "";
      document.getElementById("y").value = "";
      document.getElementById("z").value = "";
  }
  
}

//Função para aumentar altura de esfera selecionada
function aumentarAltura(){
  if(scene.children[4].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    
    if(coord0 === undefined){
      coord0 = scene.children[4].position;
      scene.children[4].position.z = parseFloat(Number(scene.children[4].position.z + 0.1).toFixed(1));
      scene.children[8].geometry.attributes.position.needsUpdate = true;
      scene.children[8].geometry.attributes.position.array[0] = coord0.x;
      scene.children[8].geometry.attributes.position.array[1] = coord0.y;
      
      scene.children[8].geometry.attributes.position.array[3] = scene.children[4].position.x;
      scene.children[8].geometry.attributes.position.array[4] = scene.children[4].position.y;
      scene.children[8].geometry.attributes.position.array[5] = scene.children[4].position.z;
      CaixaTexto(scene.children[4]);

    }else{
      scene.children[4].position.z = parseFloat(Number(scene.children[4].position.z + 0.1).toFixed(1));
      scene.children[8].geometry.attributes.position.needsUpdate = true;
      scene.children[8].geometry.attributes.position.array[0] = coord0.x;
      scene.children[8].geometry.attributes.position.array[1] = coord0.y;
      
      scene.children[8].geometry.attributes.position.array[3] = scene.children[4].position.x;
      scene.children[8].geometry.attributes.position.array[4] = scene.children[4].position.y;
      scene.children[8].geometry.attributes.position.array[5] = scene.children[4].position.z;
      CaixaTexto(scene.children[4]);
    }
    console.log("Coordenadas da Esfera C0: ", scene.children[4].position);
  }
  if(scene.children[5].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    if(coord1 === undefined){
      coord1 = scene.children[5].position;

      scene.children[5].position.z =parseFloat(Number(scene.children[5].position.z + 0.1).toFixed(1));

      scene.children[9].geometry.attributes.position.needsUpdate = true;
      scene.children[9].geometry.attributes.position.array[0] = coord1.x;
      scene.children[9].geometry.attributes.position.array[1] = coord1.y;
      
      scene.children[9].geometry.attributes.position.array[3] = scene.children[5].position.x;
      scene.children[9].geometry.attributes.position.array[4] = scene.children[5].position.y;
      scene.children[9].geometry.attributes.position.array[5] = scene.children[5].position.z;
      CaixaTexto(scene.children[5]);
    }else{
      scene.children[5].position.z =parseFloat(Number(scene.children[5].position.z + 0.1).toFixed(1));

      scene.children[9].geometry.attributes.position.needsUpdate = true;
      scene.children[9].geometry.attributes.position.array[0] = coord1.x;
      scene.children[9].geometry.attributes.position.array[1] = coord1.y;
      
      scene.children[9].geometry.attributes.position.array[3] = scene.children[5].position.x;
      scene.children[9].geometry.attributes.position.array[4] = scene.children[5].position.y;
      scene.children[9].geometry.attributes.position.array[5] = scene.children[5].position.z;
      CaixaTexto(scene.children[5]);
    }

    console.log("Coordenadas da Esfera C1: ", scene.children[5].position);
    
  }
  if(scene.children[6].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    if(coord2 === undefined){
      coord2 = scene.children[6].position;
    
      scene.children[6].position.z =parseFloat(Number(scene.children[6].position.z + 0.1).toFixed(1));

      scene.children[10].geometry.attributes.position.needsUpdate = true;
      scene.children[10].geometry.attributes.position.array[0] = coord2.x;
      scene.children[10].geometry.attributes.position.array[1] = coord2.y;
      
      scene.children[10].geometry.attributes.position.array[3] = scene.children[6].position.x;
      scene.children[10].geometry.attributes.position.array[4] = scene.children[6].position.y;
      scene.children[10].geometry.attributes.position.array[5] = scene.children[6].position.z;
      CaixaTexto(scene.children[6]);
    }else{
      scene.children[6].position.z =parseFloat(Number(scene.children[6].position.z + 0.1).toFixed(1));

      scene.children[10].geometry.attributes.position.needsUpdate = true;
      scene.children[10].geometry.attributes.position.array[0] = coord2.x;
      scene.children[10].geometry.attributes.position.array[1] = coord2.y;
      
      scene.children[10].geometry.attributes.position.array[3] = scene.children[6].position.x;
      scene.children[10].geometry.attributes.position.array[4] = scene.children[6].position.y;
      scene.children[10].geometry.attributes.position.array[5] = scene.children[6].position.z;
      CaixaTexto(scene.children[6]);
    }

    console.log("Coordenadas da Esfera C2: ", scene.children[6].position);
    
  }
  if(scene.children[7].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    if(coord3 === undefined){
      coord3 = scene.children[7].position;
    
      scene.children[7].position.z = parseFloat(Number(scene.children[7].position.z + 0.1).toFixed(1));

      scene.children[11].geometry.attributes.position.needsUpdate = true;
      scene.children[11].geometry.attributes.position.array[0] = coord3.x;
      scene.children[11].geometry.attributes.position.array[1] = coord3.y;
      
      scene.children[11].geometry.attributes.position.array[3] = scene.children[7].position.x;
      scene.children[11].geometry.attributes.position.array[4] = scene.children[7].position.y;
      scene.children[11].geometry.attributes.position.array[5] = scene.children[7].position.z;
      CaixaTexto(scene.children[7]);
    }else{
      scene.children[7].position.z = parseFloat(Number(scene.children[7].position.z + 0.1).toFixed(1));

      scene.children[11].geometry.attributes.position.needsUpdate = true;
      scene.children[11].geometry.attributes.position.array[0] = coord3.x;
      scene.children[11].geometry.attributes.position.array[1] = coord3.y;
      
      scene.children[11].geometry.attributes.position.array[3] = scene.children[7].position.x;
      scene.children[11].geometry.attributes.position.array[4] = scene.children[7].position.y;
      scene.children[11].geometry.attributes.position.array[5] = scene.children[7].position.z;
      CaixaTexto(scene.children[7]);
    }

    console.log("Coordenadas da Esfera C3: ", scene.children[7].position);
    
  }
}

//Função para diminuir altura de esfera selecionada
function diminuirAltura(){
  if(scene.children[4].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    if(coord0 === undefined){
      coord0 = scene.children[4].position;
    
      scene.children[4].position.z =parseFloat(Number(scene.children[4].position.z - 0.1).toFixed(1));

      scene.children[8].geometry.attributes.position.needsUpdate = true;
      scene.children[8].geometry.attributes.position.array[0] = coord0.x;
      scene.children[8].geometry.attributes.position.array[1] = coord0.y;
      
      scene.children[8].geometry.attributes.position.array[3] = scene.children[4].position.x;
      scene.children[8].geometry.attributes.position.array[4] = scene.children[4].position.y;
      scene.children[8].geometry.attributes.position.array[5] = scene.children[4].position.z;
      CaixaTexto(scene.children[4]);
    }else{
      scene.children[4].position.z =parseFloat(Number(scene.children[4].position.z - 0.1).toFixed(1));

      scene.children[8].geometry.attributes.position.needsUpdate = true;
      scene.children[8].geometry.attributes.position.array[0] = coord0.x;
      scene.children[8].geometry.attributes.position.array[1] = coord0.y;
      
      scene.children[8].geometry.attributes.position.array[3] = scene.children[4].position.x;
      scene.children[8].geometry.attributes.position.array[4] = scene.children[4].position.y;
      scene.children[8].geometry.attributes.position.array[5] = scene.children[4].position.z;
      CaixaTexto(scene.children[4]);
    }

    console.log("Coordenadas da Esfera C0: ", scene.children[4].position);
    
  }
  if(scene.children[5].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    if(coord1 === undefined){
      coord1 = scene.children[5].position;
    
      scene.children[5].position.z =parseFloat(Number(scene.children[5].position.z - 0.1).toFixed(1));

      scene.children[9].geometry.attributes.position.needsUpdate = true;
      scene.children[9].geometry.attributes.position.array[0] = coord1.x;
      scene.children[9].geometry.attributes.position.array[1] = coord1.y;
      
      scene.children[9].geometry.attributes.position.array[3] = scene.children[5].position.x;
      scene.children[9].geometry.attributes.position.array[4] = scene.children[5].position.y;
      scene.children[9].geometry.attributes.position.array[5] = scene.children[5].position.z;
      CaixaTexto(scene.children[5]);
    }else{
      scene.children[5].position.z =parseFloat(Number(scene.children[5].position.z - 0.1).toFixed(1));

      scene.children[9].geometry.attributes.position.needsUpdate = true;
      scene.children[9].geometry.attributes.position.array[0] = coord1.x;
      scene.children[9].geometry.attributes.position.array[1] = coord1.y;
      
      scene.children[9].geometry.attributes.position.array[3] = scene.children[5].position.x;
      scene.children[9].geometry.attributes.position.array[4] = scene.children[5].position.y;
      scene.children[9].geometry.attributes.position.array[5] = scene.children[5].position.z;
      CaixaTexto(scene.children[5]);
    }
    
    console.log("Coordenadas da Esfera C1: ", scene.children[5].position);
    
  }
  if(scene.children[6].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    if(coord2 === undefined){
      coord2 = scene.children[6].position;
    
      scene.children[6].position.z =parseFloat(Number(scene.children[6].position.z - 0.1).toFixed(1));

      scene.children[10].geometry.attributes.position.needsUpdate = true;
      scene.children[10].geometry.attributes.position.array[0] = coord2.x;
      scene.children[10].geometry.attributes.position.array[1] = coord2.y;
      
      scene.children[10].geometry.attributes.position.array[3] = scene.children[6].position.x;
      scene.children[10].geometry.attributes.position.array[4] = scene.children[6].position.y;
      scene.children[10].geometry.attributes.position.array[5] = scene.children[6].position.z;
      CaixaTexto(scene.children[6]);
    }else{
      scene.children[6].position.z =parseFloat(Number(scene.children[6].position.z - 0.1).toFixed(1));

      scene.children[10].geometry.attributes.position.needsUpdate = true;
      scene.children[10].geometry.attributes.position.array[0] = coord2.x;
      scene.children[10].geometry.attributes.position.array[1] = coord2.y;
      
      scene.children[10].geometry.attributes.position.array[3] = scene.children[6].position.x;
      scene.children[10].geometry.attributes.position.array[4] = scene.children[6].position.y;
      scene.children[10].geometry.attributes.position.array[5] = scene.children[6].position.z;
      CaixaTexto(scene.children[6]);
    }
    console.log("Coordenadas da Esfera C2: ", scene.children[6].position);
    
  }
  if(scene.children[7].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    if(coord3 === undefined){
      coord3 = scene.children[7].position;    
      scene.children[7].position.z =parseFloat(Number(scene.children[7].position.z - 0.1).toFixed(1));

      scene.children[11].geometry.attributes.position.needsUpdate = true;
      scene.children[11].geometry.attributes.position.array[0] = coord3.x;
      scene.children[11].geometry.attributes.position.array[1] = coord3.y;
      
      scene.children[11].geometry.attributes.position.array[3] = scene.children[7].position.x;
      scene.children[11].geometry.attributes.position.array[4] = scene.children[7].position.y;
      scene.children[11].geometry.attributes.position.array[5] = scene.children[7].position.z;
      CaixaTexto(scene.children[7]);
    }else{
      scene.children[7].position.z =parseFloat(Number(scene.children[7].position.z - 0.1).toFixed(1));

      scene.children[11].geometry.attributes.position.needsUpdate = true;
      scene.children[11].geometry.attributes.position.array[0] = coord3.x;
      scene.children[11].geometry.attributes.position.array[1] = coord3.y;
      
      scene.children[11].geometry.attributes.position.array[3] = scene.children[7].position.x;
      scene.children[11].geometry.attributes.position.array[4] = scene.children[7].position.y;
      scene.children[11].geometry.attributes.position.array[5] = scene.children[7].position.z;
      CaixaTexto(scene.children[7]);
    }

    console.log("Coordenadas da Esfera C3: ", scene.children[7].position);
    
  }
}

//Função para detetar o pressionar da tecla do teclado
window.addEventListener('keydown',onkeydown, false);
function onkeydown( event ) {
  let key = event.which;
  
  switch(key){
    case 8: // verifica tecla 'backspace' e reinicia a cena
      coord0 = undefined;
      coord1 = undefined;
      coord2 = undefined;
      coord3 = undefined;
      document.getElementById("name").value = "";
      document.getElementById("x").value = "";
      document.getElementById("y").value = "";
      document.getElementById("z").value = "";
      points = [];
      pointsC1 = [];
      pointsC2 = [];
      pointsC3 = [];
      init();
      break;
    case 49:  //verifica tecla '1' selecciona Esfera C0
      CaixaTexto(scene.children[4]);
      selectC0();
      console.log("Esfera c0");
      break;
    case 50:  //verifica tecla '2' selecciona Esfera C1
      CaixaTexto(scene.children[5]);
      selectC1();
      console.log("Esfera c1");
      break;
    case 51:  //verifica tecla '3' selecciona Esfera C2
      CaixaTexto(scene.children[6]);
      selectC2();
      console.log("Esfera c2");
      break;
    case 52:  //verifica tecla '4' selecciona Esfera C3
      CaixaTexto(scene.children[7]);
      selectC3();
      console.log("Esfera c3");
      break;
    case 87: //verifica tecla 'W'para aumentar altura
      aumentarAltura();
      break;
    case 83: //verifica tecla 'S' para diminuir altura
      diminuirAltura();
      break;
    case 88:  //verifica tecla 'x' selecciona quadrado
      c0 = scene.children[4].position;
      c1 = scene.children[5].position;
      c2 = scene.children[6].position;
      c3 = scene.children[7].position;

      drawTube();
      break;
  }
}

 // ao clicar com rato no plano e ter uma esfera selecionada transfere esta para lá
window.addEventListener('click', obterPontoClicado);

//Obter as posições do ecrã selecionados pelo rato ao clicar no plano
function obterPontoClicado() {
  
  raycaster.setFromCamera( mouse, camera );                                            //Definir área de visualização clicavel
  const intersects = raycaster.intersectObjects( scene.children[3].children );                                     //Obter objetos clicados com o rato
  
  if(scene.children[4].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    coord0 = intersects[0].object.position;
    scene.children[4].position.x = coord0.x;
    scene.children[4].position.y = coord0.y;
    scene.children[8].geometry.attributes.position.needsUpdate = true;
    scene.children[8].geometry.attributes.position.array[0] = coord0.x;
    scene.children[8].geometry.attributes.position.array[1] = coord0.y;
    
    scene.children[8].geometry.attributes.position.array[3] = scene.children[4].position.x;
    scene.children[8].geometry.attributes.position.array[4] = scene.children[4].position.y;
	
    
  }
  if(scene.children[5].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    coord1 = intersects[0].object.position;
    scene.children[5].position.x = coord1.x;
    scene.children[5].position.y = coord1.y;

    scene.children[9].geometry.attributes.position.needsUpdate = true;
    scene.children[9].geometry.attributes.position.array[0] = coord1.x;
    scene.children[9].geometry.attributes.position.array[1] = coord1.y;
    
    scene.children[9].geometry.attributes.position.array[3] = scene.children[5].position.x;
    scene.children[9].geometry.attributes.position.array[4] = scene.children[5].position.y;
    scene.children[9].geometry.attributes.position.array[5] = scene.children[5].position.z;
	
    
  }
  if(scene.children[6].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    coord2 = intersects[0].object.position;
    scene.children[6].position.x = coord2.x;
    scene.children[6].position.y = coord2.y;

    scene.children[10].geometry.attributes.position.needsUpdate = true;
    scene.children[10].geometry.attributes.position.array[0] = coord2.x;
    scene.children[10].geometry.attributes.position.array[1] = coord2.y;
    
    scene.children[10].geometry.attributes.position.array[3] = scene.children[6].position.x;
    scene.children[10].geometry.attributes.position.array[4] = scene.children[6].position.y;
    scene.children[10].geometry.attributes.position.array[5] = scene.children[6].position.z;
	
    
  }
  if(scene.children[7].material.transparent == false) {    //associar valores intersetados a coord se este for undefined
    coord3 = intersects[0].object.position;
    scene.children[7].position.x = coord3.x;
    scene.children[7].position.y = coord3.y;

    scene.children[11].geometry.attributes.position.needsUpdate = true;
    scene.children[11].geometry.attributes.position.array[0] = coord3.x;
    scene.children[11].geometry.attributes.position.array[1] = coord3.y;
    
    scene.children[11].geometry.attributes.position.array[3] = scene.children[7].position.x;
    scene.children[11].geometry.attributes.position.array[4] = scene.children[7].position.y;
    scene.children[11].geometry.attributes.position.array[5] = scene.children[7].position.z;
	
    
  }
  
  renderer.render( scene, camera );                                                                   //Atualizar scene
}


//classe para definir bezier curve com a função bezier3
class CustomBezierCurve extends THREE.Curve{
  constructor(){
    super();
  }
  getPoint(t, points = new THREE.Vector3()){
    let aux = new THREE.Vector3();
    let object = {c0,c1,c2,c3,t};
    aux = bezier3(object);
    return points.set(aux.x, aux.y, aux.z);

  }
}


//Desenhar o Tubo nas posiçoes fornecidas
function drawTube(){
  
  let curve = new CustomBezierCurve();
  var geometry = new THREE.TubeGeometry(curve, 64,0.25,20,false);

  var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  var mesh = new THREE.Mesh(geometry, material);
  console.log(mesh);
  scene.add(mesh);
  
}


//Função para controlar o zoom da camera
document.addEventListener("wheel", changeZoom);
function changeZoom(event) {
  if(event.deltaY <0 ){                                                                           //Opção de Aumentar o Zoom
     if(camera.zoom < 10)                                                                        //Limita o aumento do zoom da camara
      camera.zoom++;
    } else {                                                                                        //Opção de diminuir zoom
      if(camera.zoom > 1)                                                                         //Evita que a camera inverta a imagem ao diminuir
        camera.zoom--;                                                                          //o zoom de mais
    }
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
}

window.addEventListener('resize', onWindowResize);
window.onload =init;



