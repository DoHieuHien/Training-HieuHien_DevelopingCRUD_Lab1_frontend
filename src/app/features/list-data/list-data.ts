import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EXPORT_ROLE } from '../../core/models/role';
import { HasRole } from '../../shared/directives/has-role';
import { Data, DataRecord, Page } from './data';

@Component({
  selector: 'app-list-data',
  imports: [HasRole],
  templateUrl: './list-data.html',
  styleUrl: './list-data.css',
})
export class ListData implements OnInit {
  private dataService = inject(Data);
  private router = inject(Router);

  exportRoles = EXPORT_ROLE;
  page = signal<Page<DataRecord> | null>(null);
  columns = signal<string[]>([]);
  loading = signal(false);
  error = signal('');
  size = 10;

  ngOnInit(): void {
    this.load(0);
  }

  load(pageIndex: number): void {
    this.loading.set(true);
    this.error.set('');
    this.dataService.list(pageIndex, this.size).subscribe({
      next: (res) => {
        this.page.set(res);
        this.columns.set(res.content.length ? Object.keys(res.content[0].payload) : []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Không tải được dữ liệu');
        this.loading.set(false);
      },
    });
  }

  view(id: string): void {
    this.router.navigate(['/list', id]);
  }

  export(): void {
    this.dataService.export().subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
