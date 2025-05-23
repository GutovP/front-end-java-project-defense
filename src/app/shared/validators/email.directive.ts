import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { emailValidator } from "./email-validator";



@Directive({
    selector: 'appEmail',
    providers: [{provide: NG_VALIDATORS, useExisting: EmailDirective, multi: true}]
})

export class EmailDirective implements Validator {

    @Input() appEmail: string[] = [];
    constructor() {}


    validate(control: AbstractControl<any,any>): ValidationErrors | null {
        const validatorFn = emailValidator();

        return validatorFn(control);
    }

}