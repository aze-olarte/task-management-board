import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Task } from '../../../core/models/task.model';
import { TaskStatus } from '../../../core/models/task.type';

@Component({
  selector: 'app-pie-chart-status',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart-status.component.html',
  styleUrl: './pie-chart-status.component.scss',
})
export class PieChartStatusComponent {
  @Input() taskData: Task[] = [];

  pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  pieChartData = signal<ChartData<'pie', number[], string | string[]>>({
    labels: [],
    datasets: [],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskData']?.currentValue) {
      this.setChartData(changes['taskData'].currentValue);
    }
  }

  setChartData(data: Task[]) {
    const labels = [...new Set(data.map((s) => s.status))];
    const countsMap = data.reduce<Record<TaskStatus, number>>(
      (acc, { status }) => {
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      },
      { todo: 0, 'in-progress': 0, done: 0 }
    );

    this.pieChartData.set({
      labels,
      datasets: [
        {
          data: labels.map((status) => countsMap[status]),
        },
      ],
    });
  }
}
