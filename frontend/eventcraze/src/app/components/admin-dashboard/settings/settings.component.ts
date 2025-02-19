import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  // User details
  user = {
    name: "Carolyne Musenya",
    email: "carolyne@example.com",
    phone: "123-456-7890",
    address: "Nairobi, Kenya",
    role: "Admin",
    imageUrl: "https://i.pinimg.com/736x/40/66/46/406646f036baf03ffffc255e3e3fc2a7.jpg"
  };

  // Tabs for settings
  tabs = [
    { key: 'profile', label: 'My Profile' },
    { key: 'edit', label: 'Edit Profile' },
    { key: 'reset', label: 'Reset Password' }
  ];

  selectedTab = 'profile';

  // Password reset model
  passwords = {
    current: "",
    new: "",
    confirm: ""
  };

  // Switch Tabs
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  // Update Profile
  updateProfile() {
    alert("Profile updated successfully!");
  }

  // Reset Password
  resetPassword() {
    if (this.passwords.new !== this.passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password reset successful!");
  }
}
