import { Component, signal } from '@angular/core';
import { PieChartStatusComponent } from '../pie-chart-status/pie-chart-status.component';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [PieChartStatusComponent],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss'
})
export class DashboardContainerComponent {
  taskData = signal<Task[]>([]);

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.taskData.set(data);
      },
      error: (error) => this.notificationService.showError(error)
    })
  }

}
