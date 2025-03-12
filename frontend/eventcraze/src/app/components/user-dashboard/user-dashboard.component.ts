import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  userId: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId'); // Get userId from URL
      console.log('User Dashboard for:', this.userId); // Debugging
    });
  }
}
