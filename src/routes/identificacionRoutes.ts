import {Request, Response, Router } from 'express'
import { db } from '../database/database'

class IdentificacionRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getId = async (req: Request, res: Response) =>{
        const { password } = req.params
        const { user } = req.params
        setBD(false, user, password) // TRUE EN BD LOCAL/ FALSE BD ATLAS
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            res.send(mensaje)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })
        db.desconectarBD()
    }

    misRutas(){
        this._router.get('/:user&:password', this.getId)
    }
}

const setBD = async (local: boolean, userAtlas: string, passAtlas: string) => {
    const bdLocal = '<empleados>'
    const conexionLocal = `mongodb://localhost/${bdLocal}`
    if (local) {
        db.cadenaConexion = conexionLocal
    }else{
        const bdAtlas = 'prueba'
        const conexionAtlas =  
        `mongodb+srv://admin:12345@cluster0.5mbvb.mongodb.net/<empleados>?retryWrites=true&w=majority`
        db.cadenaConexion = conexionAtlas
    }
}

const obj = new IdentificacionRoutes()
obj.misRutas()
export const identificacionRoutes = obj.router