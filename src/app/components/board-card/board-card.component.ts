import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Task } from '../../core/models/task.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { BoardFormComponent, BoardFormProps } from '../board-form/board-form.component';

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
    NzModalModule
  ],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCardComponent {
  @Output() taskChanged = new EventEmitter<void>();
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

  constructor(
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}


  editTask() {
    const modal = this.modalService.create<BoardFormComponent, BoardFormProps> ({
      nzTitle: 'Edit Task',
      nzContent: BoardFormComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
        data: this.task()
      },
      nzFooter: null
    })

    modal.afterClose.subscribe(result => {
      if(result) {
        this.taskChanged.emit();
      }
    })
  }
}
