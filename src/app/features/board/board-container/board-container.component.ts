import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize } from 'rxjs';
import { Task, TaskGroupedByStatus, TaskQuery } from '../../../core/models/task.model';
import { TaskStatus } from '../../../core/models/task.type';
import { NotificationService } from '../../../core/services/notification.service';
import { TaskService } from '../../../core/services/task.service';
import { BoardCardComponent } from '../board-card/board-card.component';
import { BoardFilterComponent } from '../board-filter/board-filter.component';
import {
  BoardFormComponent,
  BoardFormProps,
} from '../board-form/board-form.component';

@Component({
  selector: 'app-board-container',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    BoardCardComponent,
    NzSpinModule,
    NzModalModule,
    NzButtonModule,
    NzLayoutModule,
    BoardFilterComponent
  ],
  templateUrl: './board-container.component.html',
  styleUrl: './board-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardContainerComponent implements OnInit {
  data = signal<TaskGroupedByStatus>({
    todo: [],
    'in-progress': [],
    done: [],
  });
  loading = signal<boolean>(false);
  readonly groups: {
    key: keyof TaskGroupedByStatus;
    label: string;
    id: string;
    connectedTo: string[];
  }[] = [
    {
      key: 'todo',
      label: 'To Do',
      id: 'todo',
      connectedTo: ['in-progress', 'done'],
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      id: 'in-progress',
      connectedTo: ['todo', 'done'],
    },
    {
      key: 'done',
      label: 'Done',
      id: 'done',
      connectedTo: ['todo', 'in-progress'],
    },
  ];
  filters = signal<TaskQuery | null>(null);

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(setLoading = true) {
    if(setLoading) {
      this.loading.set(true);
    }
    this.taskService
      .getTasksGroupedByStatus(this.filters())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.data.set(data);
        },
        error: (error) => {
          this.notificationService.showError(error);
        },
      });
  }

  drop(event: CdkDragDrop<Task[]>) {
    // As a limitation, only allow drag and drop to a different list. Prevent manual sorting
    if (event.previousContainer !== event.container) {
      const draggedItem = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.taskService.patchTaskStatus(
        draggedItem.id,
        event.container.id as TaskStatus
      ).subscribe({
        next: () => {
          this.notificationService.showSuccess('Task Updated');
          this.getData(false);
        },
        error: (error) => {
          this.notificationService.showError(error);
          this.getData();
        }
      })
    }
    return;
  }

  addTask() {
    const modal = this.modalService.create<BoardFormComponent, BoardFormProps>({
      nzTitle: 'Create New Task',
      nzContent: BoardFormComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {},
      nzFooter: null,
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.getData();
      }
    });
  }

  setFilters(filters: TaskQuery | null) {
    this.filters.set(filters);
    this.getData();
  }
}
