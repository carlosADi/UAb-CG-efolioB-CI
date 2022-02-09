/*
  UC:   Computação Gráfica
  Efólio : B
  Autor: Carlos Inácio
  Número Aluno Universidade Aberta : 1701879
  Curso: Licenciatura em Engenharia Informática
*/
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
let vec;
function bezier3(object){
    
    
    var pFinal = {};

    pFinal.x = Math.pow((1-object.t),3) * object.c0.x + 
               3 * Math.pow((1-object.t),2) * object.t * object.c1.x + 
               3 * (1-object.t) * Math.pow(object.t,2) * object.c2.x +
               Math.pow(object.t,3) * object.c3.x;
    pFinal.y = Math.pow((1-object.t),3) * object.c0.y + 
               3 * Math.pow((1-object.t),2) * object.t * object.c1.y + 
               3 * (1-object.t) * Math.pow(object.t,2) * object.c2.y +
               Math.pow(object.t,3) * object.c3.y;
    pFinal.z = Math.pow((1-object.t),3) * object.c0.z + 
               3 * Math.pow((1-object.t),2) * object.t * object.c1.z + 
               3 * (1-object.t) * Math.pow(object.t,2) * object.c2.z +
               Math.pow(object.t,3) * object.c3.z;
    vec = new THREE.Vector3(pFinal.x,pFinal.y,pFinal.z);
    console.log('pFinal é : ', vec);
    return vec;
} 

export {bezier3};