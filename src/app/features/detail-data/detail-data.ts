import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Data, DataRecord } from '../list-data/data';

@Component({
  selector: 'app-detail-data',
  imports: [KeyValuePipe, RouterLink],
  templateUrl: './detail-data.html',
  styleUrl: './detail-data.css',
})
export class DetailData implements OnInit {
  private route = inject(ActivatedRoute);
  private dataService = inject(Data);

  record = signal<DataRecord | null>(null);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!; // Mongo id là chuỗi, không parse Number
    this.dataService.detail(id).subscribe({
      next: (r) => this.record.set(r),
      error: (err) =>
        this.error.set(err.status === 404 ? 'Không tìm thấy dữ liệu' : 'Không tải được dữ liệu'),
    });
  }
}
