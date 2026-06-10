import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

  readonly isLoading = signal<Boolean>(false);
  readonly contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', Validators.required],
  });

  get controls() {
    return this.contactForm.controls;
  }

  contactHandler(): void {
    if (this.contactForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    const contactData = this.contactForm.getRawValue();

    this.contactService
      .sendMessage(
        contactData.name,
        contactData.email,
        contactData.message,
        contactData.phone,
      )
      .subscribe({
        next: () => {
          this.toastService.activate('Message sent successfully');
          this.contactForm.reset();
        },
      });
  }
}
