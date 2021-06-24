//variables  y selectores
//#1
const formulario=document.querySelector('#agregar-gasto');
const listadoGastos=document.querySelector('#gastos ul')






//eventos
//2
listadoeventos();
function listadoeventos()
{
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto);
}






//clases
class PresupuestoNumeros{
    constructor(presupuestoingresado)
    {
        this.presupuestoingresado=Number(presupuestoingresado);
        this.restanteatributo=Number(presupuestoingresado);
        this.gastos=[];
    }
    nuevoGasto(nuevogastoss){
        this.gastos=[...this.gastos,nuevogastoss];
        this.calcularRestantes();
    }
    calcularRestantes()
    {
        const gastado=this.gastos.reduce((total,gasto)=>total+gasto.cantidad,0); //itera en todo el arreglo y nos da un gran total
        this.restanteatributo=this.presupuestoingresado-gastado;
        console.log(this.restanteatributo)
    }
    eliminarGastosa(id)
    {
        this.gastos=this.gastos.filter(gastoss=>gastoss.id !==id);
        this.calcularRestantes();
    }



}
//clase para todo lo relacionado al html
class InterfazUsuario{  
    insertarpresupuesto(cantidad){ //como cantidad es un objeto entonces se hara un structuring
        
        const {presupuestoingresado,restanteatributo}=cantidad;
        //agregar valores de los atributos del objeto al html
        document.querySelector('#total').textContent=presupuestoingresado;
        document.querySelector('#restante').textContent=restanteatributo;
          
        console.log(cantidad)

    }

    MostrarAlertas(mensaje,tipomensaje) {
        //crear el vid alerta
        const divalerta= document.createElement('div');
        divalerta.classList.add('text-center','alert') //alert esuna clase de boostraps
        if(tipomensaje==='error')
        {
            divalerta.classList.add('text-center','alert-danger');

        }
        else
        {
            divalerta.classList.add('text-center','alert-success')
            
            setTimeout(() => {
                formulario.reset();
                
            }, 300);
        }
        //mensaje de error
        divalerta.textContent=mensaje;

        //insertar en el html
        document.querySelector('.primario').insertBefore(divalerta,formulario);
        setTimeout(() => {
            divalerta.remove();
            
        }, 3000);
    }
    agregarlistadoGastos(gastos)
    {
        this.limpiarHTML();
        //iterar sobre lo sgastos
        gastos.forEach(gastos1 => {
            const{cantidad,nombre,id}=gastos1;
            //hacer un li
            const nuevogasto2=document.createElement('li')
            nuevogasto2.className='list-group-item d-flex justify-content-between align-items-center ';
            //nuevogasto2.setAttribute('data-id',id) esto es lo mismo que la inea de abajo
            nuevogasto2.dataset.id=id;
        


            //agregar el html del gasto
            nuevogasto2.innerHTML=`
            ${nombre}<span class="badge badge-primary badge-pill">${cantidad} </span>
            `
            //boton para borrar el gasto
            const btnborrar=document.createElement('button')
            btnborrar.classList.add('btn','btn-danger','borrar-gasto');
            btnborrar.textContent='X'
            btnborrar.onclick=()=>{
                eliminarGasto(id)
            }
            nuevogasto2.appendChild(btnborrar);

            //agregar el gasto html
            listadoGastos.appendChild(nuevogasto2);

        });
    }
    limpiarHTML(){
        while(listadoGastos.firstChild)
        {
            listadoGastos.removeChild(listadoGastos.firstChild);

        }
    }
    sctualizarlistadoGastos(restante){
        document.querySelector('#restante').textContent=restante;
    }
    comprobarpresupuesto(presupuestoObjetos){
        const {presupuestoingresado,restanteatributo}=presupuestoObjetos
        const restantediv=document.querySelector('.restante');
        //comprobar el 25%
        if((presupuestoingresado/4)>restanteatributo)
        {
            restantediv.classList.remove('alert-success')
            restantediv.classList.remove('alert-warning')
            restantediv.classList.add('alert-danger')
           
        }else if((presupuestoingresado/2)>restanteatributo)
        {
            restantediv.classList.remove('alert-success')
            restantediv.classList.remove('alert-danger')
            restantediv.classList.add('alert-warning')
           
        }
        else{
            restantediv.classList.remove('alert-danger')
            restantediv.classList.remove('alert-warning')
            restantediv.classList.add('alert-success')
        }
        if(restanteatributo<=0)
        {
            instanciainterfaz.MostrarAlertas('Se acabo el presupuesto','error')
            formulario.querySelector('button[type="submit"]').disabled=true;
        }

    }
}
const instanciainterfaz= new InterfazUsuario();
let presupuesto;



//funciones
//3
function preguntarPresupuesto()
{
    const PedirPresupuesto=prompt('Cual es tu presupuesto')
    Number(PedirPresupuesto);
    //presupuesto===null es cuando se le da al boton de cancelar
    if(PedirPresupuesto===''|| PedirPresupuesto===null||isNaN(PedirPresupuesto)||Number(PedirPresupuesto)<=0)
    {
            window.location.reload();
            
    }

    presupuesto=new PresupuestoNumeros(PedirPresupuesto) //asigaarle a la variable global y de paso llenamos el constructor de la clase presupuesto numeros
    console.log(presupuesto)
    instanciainterfaz.insertarpresupuesto(presupuesto) //le pasamos un objeto como parametro
    
}
//anadir gastos
function agregarGasto(e)
{
    e.preventDefault();
    //leer los inputs del formulario
    const nombre=document.querySelector('#gasto').value;
    const cantidad=Number(document.querySelector('#cantidad').value);
    //validacion
    Number(cantidad);
    if (nombre===''||cantidad==='')
    {
        instanciainterfaz.MostrarAlertas('Existen campos vacios','error')

    }
    else if(isNaN(cantidad))
    {
        instanciainterfaz.MostrarAlertas('la cantidad deve ser numero','error')
    }
    else if(cantidad<=0)
    {
        instanciainterfaz.MostrarAlertas('La cantidad del gasto deve ser mayor a cero','error')

    }
    else{
        instanciainterfaz.MostrarAlertas('Gasto añadido correctamente','correcto')
        console.log('agregando gasto')

        const gastoobjLiteral={nombre,cantidad,id:Date.now()}  //esto es lo contrario a gasto, es una expresion object
         //en este variable tengo un nuevo objeto conlos npmbre y los gastod
        //añade un nuevo gasto
        presupuesto.nuevoGasto(gastoobjLiteral);
        const {gastos,restanteatributo}=presupuesto //hacemos un destructuring ya que este tiene tambien mas metodos y es el de nuevo gastos
    instanciainterfaz.agregarlistadoGastos(gastos);
    instanciainterfaz.sctualizarlistadoGastos(restanteatributo);
    instanciainterfaz.comprobarpresupuesto(presupuesto);
    
}




}
function eliminarGasto(id)
{
    presupuesto.eliminarGastosa(id)
    //elimina los gastos drl objeto
    const {gastos,restanteatributo}=presupuesto //mandando a traer el array
    //elimina los gastos del html
    instanciainterfaz.agregarlistadoGastos(gastos)

    instanciainterfaz.sctualizarlistadoGastos(restanteatributo);
    instanciainterfaz.comprobarpresupuesto(presupuesto);
    

}