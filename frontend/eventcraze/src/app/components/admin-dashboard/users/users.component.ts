import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  searchQuery: string = '';

   users: User[] = [
    {
      id: '1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '+123456789',
      address: '123 Main St, Cityville',
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: '2',
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+987654321',
      address: '456 Elm St, Townsville',
      imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: '3',
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '+192837465',
      address: '789 Oak St, Villagetown',
      imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    {
      id: '4',
      firstname: 'Bob',
      lastname: 'Williams',
      email: 'bob.williams@example.com',
      phone: '+5647382910',
      address: '159 Pine St, Suburbia',
      imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
    }
  ];

  selectedUser: User = this.users[0]; // Default selection

  constructor() {}

  ngOnInit(): void {}

  selectUser(user: User) {
    this.selectedUser = user; // Update user details dynamically
  }

  filteredUsers() {
    return this.users.filter(user => 
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
