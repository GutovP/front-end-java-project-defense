import { ValidatorFn } from "@angular/forms";


export function passwordGroupValidator(controlName1: string, controlName2: string): ValidatorFn {

    return (control) => {

        const ctrl1 = control.get(controlName1);
        const ctrl2 = control.get(controlName2);

        return ctrl1?.value === ctrl2?.value ? null : {passwordGroupValidator : true};
    };
}