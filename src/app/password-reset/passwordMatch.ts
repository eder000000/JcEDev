import { FormGroup, ValidatorFn } from "@angular/forms";

export function PasswordMatch(newPassword: string, confirmNewPassword: string): ValidatorFn {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[newPassword];
        const matchingControl = formGroup.controls[confirmNewPassword];
        if (matchingControl.errors && !matchingControl.errors.passwordMatch) {
            return control;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ passwordMatch: true });
        } else {
            matchingControl.setErrors(null);
        }  
    }
  }