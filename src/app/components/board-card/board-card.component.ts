import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Task } from '../../core/models/task.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [
    NzCardModule,
    NzTagModule,
    DatePipe,
    TitleCasePipe,
    TruncatePipe,
    NzIconModule,
  ],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCardComponent {
  readonly task = input<Task>();

  priorityColor = computed(() => {
    const priority = this.task()?.priority;
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  });
}
