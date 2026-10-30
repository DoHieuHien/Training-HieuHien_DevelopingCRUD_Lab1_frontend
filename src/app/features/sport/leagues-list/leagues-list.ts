import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EXPORT_ROLE } from '../../../core/models/role';
import { HasRole } from '../../../shared/directives/has-role';
import { LeagueRow, PageRes, Sport } from '../sport';

@Component({
  selector: 'app-leagues-list',
  imports: [HasRole, DatePipe],
  templateUrl: './leagues-list.html',
  styleUrl: './leagues-list.css',
})
export class LeaguesList implements OnInit {
  private sport = inject(Sport);
  private router = inject(Router);

  exportRoles = EXPORT_ROLE;
  page = signal<PageRes<LeagueRow> | null>(null);
  loading = signal(false);
  error = signal('');
  size = 10;

  ngOnInit(): void {
    this.load(0);
  }

  load(index: number): void {
    this.loading.set(true);
    this.error.set('');
    this.sport.leagues(index, this.size).subscribe({
      next: (p) => {
        this.page.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Không tải được danh sách leagues');
        this.loading.set(false);
      },
    });
  }

  viewMatches(row: LeagueRow): void {
    this.router.navigate(['/matches'], {
      queryParams: { leagueShortcut: row.leagueShortcut, leagueSeason: row.leagueSeason },
    });
  }

  export(): void {
    this.sport.exportLeagues();
  }
}
