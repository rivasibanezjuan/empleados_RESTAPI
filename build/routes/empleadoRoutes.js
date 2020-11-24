"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.empleadoRoutes = void 0;
const express_1 = require("express");
const empleado_1 = require("../model/empleado");
const database_1 = require("../database/database");
class EmpleadoRoutes {
    constructor() {
        this.getEmpleados = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield empleado_1.Empleados.find();
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.nuevoEmpleadoPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { Nombre, DNI, FechaN, Telefono, ContratoF, Sueldo, CampoP, FinContrato } = req.body;
            console.log(DNI);
            const dSchema = {
                _Nombre: Nombre,
                _DNI: DNI,
                _FechaN: new Date(FechaN),
                _Telefono: parseInt(Telefono),
                _ContratoF: JSON.parse(ContratoF),
                _Sueldo: parseInt(Sueldo),
                _CampoP: CampoP,
                _FinContrato: new Date(FinContrato)
            };
            console.log(dSchema);
            const oSchema = new empleado_1.Empleados(dSchema);
            yield database_1.db.conectarBD();
            yield oSchema.save()
                .then((doc) => {
                console.log('Salvado Correctamente: ' + doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.send('Error: ' + err);
            });
            yield database_1.db.desconectarBD();
        });
        this.getSueldoN = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let empleado;
            let sueldo = 0;
            const { DNI } = req.params;
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                yield empleado_1.Empleados.findOne({ _DNI: { $eq: DNI } }, (error, doc) => {
                    if (error) {
                        console.log(error);
                        res.json({ "error": "mensaje: " + error });
                    }
                    else {
                        if (doc == null) {
                            console.log('No existe');
                            res.json({});
                        }
                        else {
                            console.log('Existe: ' + doc);
                            empleado =
                                new empleado_1.Empleado(doc._Nombre, doc._DNI, doc._FechaN, doc._Telefono, doc._ContratoF, doc._Sueldo, doc._CampoP, doc._FinContrato);
                            empleado.Sueldo = doc._Sueldo;
                            sueldo = empleado.SueldoN();
                            res.json({ "DNI": DNI, "Sueldo": sueldo });
                        }
                    }
                });
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        this.getSueldos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let arrayT = new Array();
            yield database_1.db.conectarBD();
            let tmpEmpleado;
            let dEmpleado;
            const query = yield empleado_1.Empleados.find({});
            for (dEmpleado of query) {
                tmpEmpleado =
                    new empleado_1.Empleado(dEmpleado._Nombre, dEmpleado._DNI, dEmpleado._FechaN, dEmpleado._Telefono, dEmpleado._ContratoF, dEmpleado._Sueldo, dEmpleado._CampoP, dEmpleado._FinContrato);
                tmpEmpleado.Sueldo = dEmpleado._Sueldo;
                const doc = {
                    DNI: dEmpleado._DNI,
                    Sueldo: tmpEmpleado.SueldoN()
                };
                arrayT.push(doc);
                console.log(`Empleado ${tmpEmpleado.DNI} Sueldo: ${tmpEmpleado.SueldoN()}`);
            }
            console.log(arrayT);
            res.json(arrayT);
            yield database_1.db.desconectarBD();
        });
        this.getDelete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { DNI } = req.params;
            yield database_1.db.conectarBD();
            yield empleado_1.Empleados.findOneAndDelete({ _DNI: DNI }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        console.log(`No encontrado`);
                        res.send(`No encontrado`);
                    }
                    else {
                        console.log('Borrado correcto: ' + doc);
                        res.send('Borrado correcto: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this.actualiza = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { DNI } = req.params;
            const { Nombre, FechaN, Telefono, ContratoF, Sueldo, CampoP, FinContrato } = req.body;
            yield database_1.db.conectarBD();
            yield empleado_1.Empleados.findOneAndUpdate({ _DNI: DNI }, {
                _Nombre: Nombre,
                _DNI: DNI,
                _FechaN: FechaN,
                _Telefono: Telefono,
                _ContratoF: ContratoF,
                _Sueldo: Sueldo,
                _CampoP: CampoP,
                _FinContrato: FinContrato
            }, {
                new: true,
                runValidators: true
            })
                .then((docu) => {
                if (docu == null) {
                    console.log('El empleado que desea modificar no existe');
                    res.json({ "Error": "No existe: " + DNI });
                }
                else {
                    console.log('Modificado Correctamente: ' + docu);
                    res.json(docu);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/', this.getEmpleados);
        this._router.post('/nuevoP', this.nuevoEmpleadoPost);
        this._router.get('/Sueldo/:DNI', this.getSueldoN);
        this._router.get('/Sueldos', this.getSueldos);
        this._router.get('/borrar/:DNI', this.getDelete);
        this._router.post('/actualiza/:DNI', this.actualiza);
    }
}
const obj = new EmpleadoRoutes();
obj.misRutas();
exports.empleadoRoutes = obj.router;
