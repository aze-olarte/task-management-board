import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TaskQuery } from '../../core/models/task.model';
import { TaskPriority, TaskStatus } from '../../core/models/task.type';

@Component({
  selector: 'app-board-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzDividerModule
  ],
  templateUrl: './board-filter.component.html',
  styleUrl: './board-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BoardFilterComponent {
  @Output() filterChanged = new EventEmitter<TaskQuery | null>();

  filterForm = new FormGroup({
    status: new FormControl<TaskStatus[]>([], { nonNullable: true }),
    priority: new FormControl<TaskPriority[]>([], { nonNullable: true }),
    dueDate: new FormControl(null),
  });

  sortForm = new FormGroup({
    field: new FormControl('', { nonNullable: true }),
    dir: new FormControl('asc', { nonNullable: true }),
  });

  form = new FormGroup({
    filters: this.filterForm,
    sort: this.sortForm
  });

  clear() {
    this.form.reset();
    this.filterChanged.emit(null)
  }

  onSubmit() {
    const filters = this.form.getRawValue();
    this.filterChanged.emit(filters);
  }
}
