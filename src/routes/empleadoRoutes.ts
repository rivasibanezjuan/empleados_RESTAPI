import {Request, Response, Router } from 'express'
import { Empleados, Empleado, eEmpleado } from '../model/empleado'
import { db } from '../database/database'

class EmpleadoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getEmpleados = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Empleados.find()
            console.log(query)
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        db.desconectarBD()
    }
  

    private nuevoEmpleadoPost = async (req: Request, res: Response) => {
        console.log(req.body)
        const { Nombre, DNI, FechaN, Telefono, ContratoF, Sueldo, CampoP, FinContrato } = req.body

        console.log(DNI)

        const dSchema = {
            _Nombre: Nombre,
            _DNI: DNI,
            _FechaN: new Date(FechaN),
            _Telefono: parseInt(Telefono),
            _ContratoF: JSON.parse(ContratoF),
            _Sueldo: parseInt(Sueldo),
            _CampoP: CampoP,
            _FinContrato: new Date(FinContrato)
        }
        console.log(dSchema)
        const oSchema = new Empleados(dSchema)
        await db.conectarBD()
        await oSchema.save()
        .then( (doc) => {
            console.log('Salvado Correctamente: '+ doc)
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log('Error: '+ err)
            res.send('Error: '+ err)
        }) 

        await db.desconectarBD()
    }

    private getSueldoN = async (req: Request, res: Response) => {
        let empleado: Empleado
        let sueldo: number = 0
        const { DNI } = req.params
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            await Empleados.findOne({_DNI: {$eq: DNI}},
                (error, doc: any) => {
                    if(error) {
                        console.log(error)
                        res.json({"error": "mensaje: "+error})
                    }else{
                        if (doc == null) {
                            console.log('No existe')
                            res.json({})
                        }else {
                            console.log('Existe: '+ doc)
                            empleado = 
                                new Empleado(doc._Nombre, doc._DNI, doc._FechaN, doc._Telefono, doc._ContratoF, doc._Sueldo, doc._CampoP, doc._FinContrato)
                            empleado.Sueldo = doc._Sueldo 
                            sueldo = empleado.SueldoN()
                            res.json({"DNI": DNI, "Sueldo": sueldo})
                        }
                    }
                }
            )

        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        db.desconectarBD()
    }
    private getSueldos =  async (req: Request, res: Response) => {
        type tDoc = {
            DNI: String,
            Sueldo: Number
        }
        let arrayT: Array<tDoc> = new Array<tDoc>()
        await db.conectarBD()
        let tmpEmpleado: Empleado
        let dEmpleado: any 
        const query =  await Empleados.find( {} )
        for (dEmpleado of query){
            tmpEmpleado = 
                new Empleado(dEmpleado._Nombre, dEmpleado._DNI, 
                    dEmpleado._FechaN, dEmpleado._Telefono, dEmpleado._ContratoF, dEmpleado._Sueldo, 
                    dEmpleado._CampoP, dEmpleado._FinContrato)
            tmpEmpleado.Sueldo = dEmpleado._Sueldo 
            const doc: tDoc = {
                DNI:  dEmpleado._DNI,
                Sueldo: tmpEmpleado.SueldoN()
            }
            arrayT.push(doc)

            console.log(`Empleado ${tmpEmpleado.DNI} Sueldo: ${tmpEmpleado.SueldoN()}`)

        }
        console.log(arrayT)
        res.json(arrayT)
        await db.desconectarBD()   
    }

    private getDelete = async (req: Request, res: Response) => {
        const {DNI } = req.params
        await db.conectarBD()
        await Empleados.findOneAndDelete(
            { _DNI: DNI }, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        console.log(`No encontrado`)
                        res.send(`No encontrado`)
                    }else {
                        console.log('Borrado correcto: '+ doc)
                        res.send('Borrado correcto: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }
    
    private actualiza = async (req: Request, res: Response) => {
        const { DNI } = req.params
        const { Nombre, FechaN, Telefono, ContratoF, Sueldo, CampoP, FinContrato } = req.body
        await db.conectarBD()
        await Empleados.findOneAndUpdate(
                { _DNI: DNI }, 
                {

            _Nombre: Nombre,
            _DNI: DNI,
            _FechaN: FechaN,
            _Telefono: Telefono,
            _ContratoF: ContratoF,
            _Sueldo: Sueldo,
            _CampoP: CampoP,
            _FinContrato: FinContrato

                },
                {
                    new: true,
                    runValidators: true
                }  
            )
            .then( (docu) => {
                    if (docu==null){
                        console.log('El empleado que desea modificar no existe')
                        res.json({"Error":"No existe: "+DNI})
                    } else {
                        console.log('Modificado Correctamente: '+ docu) 
                        res.json(docu)
                    }
                    
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            )
        db.desconectarBD()
    }

    misRutas(){
        this._router.get('/', this.getEmpleados)
        this._router.post('/nuevoP', this.nuevoEmpleadoPost)
        this._router.get('/Sueldo/:DNI', this.getSueldoN)
        this._router.get('/Sueldos', this.getSueldos)
        this._router.get('/borrar/:DNI', this.getDelete)
        this._router.post('/actualiza/:DNI', this.actualiza)
    }
}

const obj = new EmpleadoRoutes()
obj.misRutas()
export const empleadoRoutes = obj.router
