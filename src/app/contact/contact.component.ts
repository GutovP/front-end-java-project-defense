
import { Component, computed, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { ContactService } from './contact.service';
import { ToastService } from '../core/toast/toast.service';


@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {

  private contactService = inject(ContactService);
  private toastService = inject(ToastService);
  private fb = inject(NonNullableFormBuilder);


    readonly contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', Validators.required],
    });
  

  name = computed(() => this.contactForm.get('name'));
  email = computed(() => this.contactForm.get('email'));
  phone = computed(() => this.contactForm.get('phone'));
  message = computed(() => this.contactForm.get('message'));

  contactHandler(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const {name, email, phone, message} = this.contactForm.getRawValue();

    this.contactService.sendMessage(name, email, message, phone).subscribe({
      next: () => {
        this.toastService.activate('Message sent successfully');
        this.contactForm.reset();
      }
    })
  }
}
