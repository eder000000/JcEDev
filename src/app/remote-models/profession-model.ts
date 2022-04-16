import { Evidence } from "./evidence-model";

export interface Profession {
    profession_id:number, 
    profession_skill:number, 
    profession_evidences:Evidence[]
}