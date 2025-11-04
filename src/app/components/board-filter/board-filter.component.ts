import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TaskQuery } from '../../core/models/task.model';
import { TaskPriority, TaskStatus } from '../../core/models/task.type';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
    NzDividerModule,
    NzDropDownModule,
    NzIconModule
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
    text: new FormControl('', { nonNullable: true }),
  });

  sortForm = new FormGroup({
    field: new FormControl('', { nonNullable: true }),
    dir: new FormControl('asc', { nonNullable: true }),
  });

  form = new FormGroup({
    filters: this.filterForm,
    sort: this.sortForm,
  });
  searchHistory: string[] = [];

  ngOnInit() {
    this.loadSearchHistory();
  }

  loadSearchHistory(): void {
    this.searchHistory = this.getStoredHistory();
  }

  getStoredHistory(): string[] {
    const stored = localStorage.getItem('searchHistory');
    return stored ? JSON.parse(stored) : [];
  }

  applySearchHistory(term: string): void {
    this.filterForm.get('text')!.setValue(term);
  }

  onHistoryVisibleChange(visible: boolean): void {
    if (visible) this.loadSearchHistory();
  }

  clear() {
    this.form.reset();
    this.filterChanged.emit(null);
  }

  onSubmit() {
    const query = this.form.getRawValue();

    const term = query.filters.text.trim();
    this.addToHistory(term);
    this.filterChanged.emit(query);
    
  }

  addToHistory(term: string): void {
    const stored = this.getStoredHistory();
    const updated = [term, ...stored.filter((t) => t !== term)].slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
    this.searchHistory = updated;
  }
  
}
