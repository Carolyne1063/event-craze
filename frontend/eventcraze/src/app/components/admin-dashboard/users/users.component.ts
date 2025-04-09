import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/userService';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNo: string;
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
  users: User[] = [];
  selectedUser: User = this.createEmptyUser(); 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data: any[]) => { 
        this.users = data.map(user => ({
          id: user.id,
          firstname: user.firstName,  
          lastname: user.lastName,    
          email: user.email,
          phoneNo: user.phoneNo,
          address: user.address || '', 
          imageUrl: user.image || 'https://picsum.photos/150' 
        }));
  
        if (this.users.length > 0) {
          this.selectedUser = this.users[0]; 
        }
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }  

  selectUser(user: User) {
    this.selectedUser = user;
  }

  filteredUsers() {
    return this.users.filter(user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  private createEmptyUser(): User {
    return {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phoneNo: '',
      address: '',
      imageUrl: 'https://via.placeholder.com/150'
    };
  }
}
