import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ImportResult, LeagueOption, Sport } from '../sport';

@Component({
  selector: 'app-sport-import',
  imports: [FormsModule, RouterLink],
  templateUrl: './sport-import.html',
  styleUrl: './sport-import.css',
})
export class SportImport implements OnInit {
  private sport = inject(Sport);

  options = signal<LeagueOption[]>([]);
  panelOpen = signal(false);
  selectedShortcut = signal('');
  selectedSeason = signal('');
  loadingLeagues = signal(false);
  loadingMatches = signal(false);
  message = signal('');
  isError = signal(false);
  lastImported = signal<{ shortcut: string; season: string } | null>(null);

  hasLeagues = computed(() => this.options().length > 0);

  shortcuts = computed(() => {
    const map = new Map<string, string>();
    for (const o of this.options())
      if (!map.has(o.leagueShortcut)) map.set(o.leagueShortcut, o.leagueName);
    return [...map.entries()].map(([shortcut, name]) => ({ shortcut, name }));
  });

  seasons = computed(() =>
    [
      ...new Set(
        this.options()
          .filter((o) => o.leagueShortcut === this.selectedShortcut())
          .map((o) => o.leagueSeason),
      ),
    ]
      .sort()
      .reverse(),
  );

  ngOnInit(): void {
    this.loadOptions();
  }

  loadOptions(): void {
    this.sport.leagueOptions().subscribe({
      next: (o) => this.options.set(o),
      error: () => {
        this.options.set([]);
        this.show(true, 'Không kiểm tra được dữ liệu leagues (dịch vụ thể thao chưa sẵn sàng?)');
      },
    });
  }

  // ---------- Import Leagues: bấm là gọi API ----------
  importLeagues(): void {
    this.loadingLeagues.set(true);
    this.message.set('');
    this.lastImported.set(null);
    this.sport.importLeagues().subscribe({
      next: (r) => {
        this.loadingLeagues.set(false);
        this.show(false, this.format('Import Leagues thành công', r));
        this.loadOptions(); // có dữ liệu rồi thì nút Import Match mới hiện
      },
      error: (e) => this.fail(e, this.loadingLeagues),
    });
  }

  // ---------- Import Match: bấm để hiện select, chọn mùa xong là gọi API ----------
  openPanel(): void {
    this.message.set('');
    this.lastImported.set(null);
    this.panelOpen.set(true);
  }

  closePanel(): void {
    this.panelOpen.set(false);
    this.selectedShortcut.set('');
    this.selectedSeason.set('');
  }

  onShortcutChange(value: string): void {
    this.selectedShortcut.set(value);
    this.selectedSeason.set('');
  }

  onSeasonChange(season: string): void {
    this.selectedSeason.set(season);
    if (season) this.importMatches(); // chọn xong là gọi luôn
  }

  private importMatches(): void {
    const shortcut = this.selectedShortcut();
    const season = this.selectedSeason();

    this.loadingMatches.set(true);
    this.message.set('');
    this.sport.importMatches(shortcut, season).subscribe({
      next: (r) => {
        this.loadingMatches.set(false);
        this.show(false, this.format(`Import Matches ${shortcut} ${season} thành công`, r));
        this.lastImported.set({ shortcut, season });
        this.closePanel();
      },
      error: (e) => {
        this.fail(e, this.loadingMatches);
        this.selectedSeason.set(''); // để người dùng chọn lại cùng mùa đó vẫn kích hoạt được
      },
    });
  }

  private format(title: string, r: ImportResult): string {
    return `${title}: lấy ${r.fetched}, thêm mới ${r.inserted}, cập nhật ${r.updated}`;
  }

  private show(error: boolean, text: string): void {
    this.isError.set(error);
    this.message.set(text);
  }

  private fail(e: HttpErrorResponse, loading: { set(v: boolean): void }): void {
    loading.set(false);
    const text =
      e.status === 0
        ? 'Không kết nối được backend'
        : e.status === 401
          ? 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
          : e.status === 403
            ? 'Tài khoản của bạn không có quyền import'
            : (e.error?.message ?? `Thất bại (HTTP ${e.status})`);
    this.show(true, text);
  }
}
