import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  const emailPattern = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

  return (control) => {
    const isEmailValid = control.value === '' || emailPattern.test(control.value);

    return isEmailValid ? null : { emailValidator: true };
  };
}
