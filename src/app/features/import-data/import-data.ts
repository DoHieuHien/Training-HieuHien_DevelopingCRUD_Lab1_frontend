import { Component, inject, signal } from '@angular/core';
import { Data } from '../list-data/data';

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.html',
  styleUrl: './import-data.css',
})
export class ImportData {
  private data = inject(Data);

  file = signal<File | null>(null);
  loading = signal(false);
  message = signal('');
  isError = signal(false);

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = input.files?.[0] ?? null;

    this.message.set('');
    this.isError.set(false);

    if (selected && !selected.name.toLowerCase().endsWith('.csv')) {
      this.file.set(null);
      input.value = ''; // xóa file vừa chọn khỏi ô input
      this.isError.set(true);
      this.message.set('File không hợp lệ, chỉ chấp nhận file .csv');
      return;
    }

    this.file.set(selected);
  }

  import(): void {
    const f = this.file();
    if (!f) return;

    this.loading.set(true);
    this.data.import(f).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.isError.set(false);
        this.message.set(`${res.message} (${res.count})`);
      },
      error: (err) => {
        this.loading.set(false);
        this.isError.set(true);
        this.message.set(err.error?.message ?? 'Import thất bại');
      },
    });
  }
}
