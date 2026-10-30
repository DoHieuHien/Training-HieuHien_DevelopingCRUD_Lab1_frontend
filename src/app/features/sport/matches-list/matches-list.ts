import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EXPORT_ROLE} from '../../../core/models/role';
import { HasRole } from '../../../shared/directives/has-role';
import { MatchRow, PageRes, Sport } from '../sport';

@Component({
  selector: 'app-matches-list',
  imports: [HasRole, DatePipe, RouterLink],
  templateUrl: './matches-list.html',
  styleUrl: './matches-list.css',
})
export class MatchesList {
  private sport = inject(Sport);
  private route = inject(ActivatedRoute);

  exportRoles = EXPORT_ROLE
  shortcut = signal<string | null>(null);
  season = signal<string | null>(null);
  page = signal<PageRes<MatchRow> | null>(null);
  loading = signal(false);
  error = signal('');
  size = 10;

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((p) => {
      this.shortcut.set(p.get('leagueShortcut'));
      this.season.set(p.get('leagueSeason'));
      this.load(0);
    });
  }

  load(index: number): void {
    this.loading.set(true);
    this.error.set('');
    this.sport.matches(this.shortcut(), this.season(), index, this.size).subscribe({
      next: (p) => {
        this.page.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Không tải được danh sách matches');
        this.loading.set(false);
      },
    });
  }

  export(): void {
    this.sport.exportMatches(this.shortcut(), this.season());
  }
}
