  import { Component, EventEmitter, Input, Output } from '@angular/core';
  import { Contact } from '../interfaces/contact.model';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

  @Component({
    selector: 'app-contact-edit',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './contact-edit.component.html',
    styleUrl: './contact-edit.component.css'
  })
  export class ContactEditComponent {
    @Input() contact: Contact | null = null; // Contact to edit or null for new
    @Output() save = new EventEmitter<Contact>();
    @Output() cancel = new EventEmitter<void>();

    contactForm: FormGroup;

    constructor(private fb: FormBuilder) {
      this.contactForm = this.fb.group({
        id: [null],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      });
    }

    ngOnInit(): void {
      if (this.contact) {
        this.contactForm.patchValue(this.contact);
      }
    }

    onSubmit(): void {
      if (this.contactForm.valid) {
        const contactValue = this.contactForm.value;
        if (contactValue.id === null) {
          contactValue.id = 0; // Set id to 0 if it is null
        }
        this.save.emit(contactValue);
      }
    }
    onCancel(): void {
      this.cancel.emit();
    }
  }
