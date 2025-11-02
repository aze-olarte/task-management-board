import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize } from 'rxjs';
import { Task, TaskGroupedByStatus } from '../../core/models/task.model';
import { NotificationService } from '../../core/services/notification.service';
import { TaskService } from '../../core/services/task.service';
import { BoardCardComponent } from '../board-card/board-card.component';
import { BoardFormComponent, BoardFormProps } from '../board-form/board-form.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropList, CdkDrag, BoardCardComponent, NzSpinModule, NzModalModule, NzButtonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
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
      id: 'todoList',
      connectedTo: ['inProgressList', 'doneList'],
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      id: 'inProgressList',
      connectedTo: ['todoList', 'doneList'],
    },
    {
      key: 'done',
      label: 'Done',
      id: 'doneList',
      connectedTo: ['todoList', 'inProgressList'],
    },
  ];

  constructor(
    private taskService: TaskService,
    private notificationService: NotificationService,
    private modalService: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading.set(true);
    this.taskService
      .getTasksGroupedByStatus()
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
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  addTask() {
    const modal = this.modalService.create<BoardFormComponent, BoardFormProps> ({
      nzTitle: 'Create New Task',
      nzContent: BoardFormComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzData: {
      },
      nzFooter: null
    })

    modal.afterClose.subscribe(result => {
      if(result) {
        this.getData();
      }
    })
  }
}
