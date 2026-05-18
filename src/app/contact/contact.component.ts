import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ContactService } from './contact.service';
import { ToastService } from '../core/toast/toast.service';


@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {

  private contactService = inject(ContactService);
  private toastService = inject(ToastService);
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', Validators.required],
    });
  }

  get name() {
    return this.contactForm.get('name');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get phone() {
    return this.contactForm.get('phone');
  }
  get message() {
    return this.contactForm.get('message');
  }

  contactHandler(): void {
    if (this.contactForm.invalid) {
      return;
    }

    const {name, email, phone, message} = this.contactForm.value;

    this.contactService.sendMessage(name, email, message, phone).subscribe({
      next: () => {
        this.toastService.activate('Message sent successfully');
        this.contactForm.reset();
      }
    })
  }
}
