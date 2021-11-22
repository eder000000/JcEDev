import { Speciality } from './specialities.model';

export class Oficio {
	public id: string;
	public name: string;
	public description: string;
	public specialities: Speciality[];

	constructor(id: string, name: string, description: string, specialities: Speciality[]) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.specialities = specialities;
	}
}
