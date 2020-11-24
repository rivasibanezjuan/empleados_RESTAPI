"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empleados = exports.Empleado = void 0;
const mongoose_1 = require("mongoose");
class Empleado {
    constructor(Nombre, DNI, FechaN, Telefono, ContratoF, Sueldo, CampoP, FinContrato) {
        this._Nombre = Nombre;
        this._DNI = DNI;
        this._FechaN = FechaN;
        this._Telefono = Telefono;
        this._ContratoF = ContratoF;
        this._Sueldo = Sueldo;
        this._CampoP = CampoP;
        this._FinContrato = FinContrato;
    }
    // REALIZAMOS LOS GETs CORRESPONDIENTES A CADA CAMPO DEL CONSTRUCTOR
    get Nombre() {
        return this._Nombre;
    }
    get DNI() {
        return this._DNI;
    }
    get FechaN() {
        return this._FechaN;
    }
    get Telefono() {
        return this._Telefono;
    }
    get ContratoF() {
        return this._ContratoF;
    }
    get Sueldo() {
        return this._Sueldo;
    }
    get CampoP() {
        return this._CampoP;
    }
    get FinContrato() {
        return this._FinContrato;
    }
    // REALIZAMOS LOS SETs CORRESPONDIENTES A CADA CAMPO DEL CONSTRUCTOR
    set Nombre(_Nombre) {
        this._Nombre = _Nombre;
    }
    set DNI(_DNI) {
        if (this._DNI.length != 8) {
            throw "El DNI son 8 caracteres";
        }
        this._DNI = _DNI;
    }
    set FechaN(_FechaN) {
        if (this._FechaN > new Date(2002 - 11 - 24)) {
            throw "El empleado debe de tener como mínimo 18 años";
        }
        else {
            if (this._FechaN < new Date(1955 - 11 - 24)) {
                throw "El empleado no puede tener más de 65 años";
            }
        }
        this._FechaN = _FechaN;
    }
    set Telefono(_Telefono) {
        if (this._Telefono.toString.length != 9) {
            throw "El DNI son 8 caracteres";
        }
        this._Telefono = _Telefono;
    }
    set ContratoF(_ContratoF) {
        this._ContratoF = _ContratoF;
    }
    set Sueldo(_Sueldo) {
        if (_Sueldo <= 950) {
            throw "El sueldo no puede ser inferior al SMI[950]";
        }
        this._Sueldo = _Sueldo;
    }
    set CampoP(_CampoP) {
        this._CampoP = _CampoP;
    }
    set FinContrato(_FinContrato) {
        if (_FinContrato < new Date()) {
            throw "La fecha de finalización del contrato debe de ser en la fecha actual o en una futura";
        }
        this._FinContrato = _FinContrato;
    }
    // CREAMOS EL MÉTODO
    SueldoN() {
        let SueldoN;
        SueldoN = (this._Sueldo * 0.79);
        if (SueldoN == 0) {
            throw "ERROR: No se ha introducido el sueldo del empleado, inténtelo de nuevo";
        }
        return SueldoN;
    }
}
exports.Empleado = Empleado;
// DEFINIMOS NUESTRO SCHEMA
const empleadoSchema = new mongoose_1.Schema({
    _Nombre: {
        type: String
    },
    _DNI: {
        type: String,
        unique: true
    },
    _FechaN: {
        type: Date
    },
    _Telefono: {
        type: Number
    },
    _ContratoF: {
        type: Boolean
    },
    _Sueldo: {
        type: Number
    },
    _CampoP: {
        type: String
    },
    _FinContrato: {
        type: Date
    },
});
// COLECCIÓN DE LA BD
exports.Empleados = mongoose_1.model('empleado', empleadoSchema);
