import { Component, Input, signal, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Task } from '../../../core/models/task.model';
import { TaskPriority } from '../../../core/models/task.type';

@Component({
  selector: 'app-bar-chart-priority',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './bar-chart-priority.component.html',
  styleUrl: './bar-chart-priority.component.scss',
})
export class BarChartPriorityComponent {
  @Input() taskData: Task[] = [];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  barChartData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskData']?.currentValue) {
      this.setChartData(changes['taskData'].currentValue);
    }
  }

  setChartData(data: Task[]) {
    const labels = [...new Set(data.map((s) => s.priority))];
    const countsMap = data.reduce<Record<TaskPriority, number>>(
      (acc, { priority }) => {
        acc[priority] = (acc[priority] ?? 0) + 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    this.barChartData.set({
      labels,
      datasets: [
        {
          label: 'Tasks by Priority',
          data: labels.map((priority) => countsMap[priority]),
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        },
      ],
    });
  }
}
