export class Profesional {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: Date;
    numeroCelular: number;
    fotoPerfil: String;
    calle: string;
    numExterior: number;
    numInterior: number;
    colonia: string;
    municipio: string;
    oficios: {
        fotos: string[]; 
        oficio_descripcion: string;
        oficio_name: string;
    }[];
    ubicacionTrabajo: string;
    email: string;
    contraseña: string;   
}