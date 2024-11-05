import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { CommonModule } from '@angular/common';
import { Contact } from '../interfaces/contact.model';
import { ContactEditComponent } from '../contact-edit/contact-edit.component';


@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts : Contact [] = [];
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;

  constructor(private contactService : ContactService) { }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService.getContacts().subscribe((data:Contact[]) => {
      console.log(data);
     this.contacts = data;
    });
  }
  
  openModal(contact: Contact | null = null): void {
    if (!this.modalContainer) {
      console.error('Modal container is not available');
      return;
    }

    this.modalContainer.clear();
    const componentRef = this.modalContainer.createComponent(ContactEditComponent);
    componentRef.instance.contact = contact;
    componentRef.instance.save.subscribe((savedContact: Contact) => {
      this.onSave(savedContact);
      componentRef.destroy();
    });
    componentRef.instance.cancel.subscribe(() => {
      componentRef.destroy();
    });
  }


  addNewContact(): void {
    this.openModal();
  }

  editContact(contactId: number): void {
    const contact = this.contacts.find(c => c.id === contactId);
    if (contact) {
      this.openModal(contact);
    }
  }

  onSave(contact: Contact): void {
    if (contact.id) {
      this.contactService.updateContact(contact).subscribe(() => this.getContacts());
    } else {
      this.contactService.addContact(contact).subscribe(() => this.getContacts());
    }
  }

  deleteContact(contactId: number): void {
    this.contactService.deleteContact(contactId).subscribe(() => this.getContacts());
  }

}
