import { Profession } from "./profession-model";
import { WorkingArea } from "./working-area-model";

export interface PublicUserModel {
    user_model_id?:number, 
    user_role_id?:number, 
    user_model_first_name?:string, 
    user_model_last_name?:string, 
    user_model_surname?:string,  
    user_model_phone_number?:string, 
    user_model_media_id?:number, 
    user_model_org?:number, 
    user_model_professions?:Profession[], 
    user_model_working_areas?:WorkingArea[]
}