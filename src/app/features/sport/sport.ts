import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeagueOption {
  leagueId: number;
  leagueName: string;
  leagueShortcut: string;
  leagueSeason: string;
}
export interface LeagueRow extends LeagueOption {
  sportName: string;
  hasMatches: boolean;
  lastImportedAt: string;
}
export interface MatchRow {
  matchId: number;
  leagueShortcut: string;
  leagueSeason: string;
  matchDateTime: string;
  groupName: string;
  team1: string;
  team2: string;
  score: string | null;
  finished: boolean;
}
export interface PageRes<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
export interface ImportResult {
  target: string;
  fetched: number;
  inserted: number;
  updated: number;
}

@Injectable({ providedIn: 'root' })
export class Sport {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/sport`;

  importLeagues(): Observable<ImportResult> {
    return this.http.post<ImportResult>(`${this.base}/leagues/import`, null);
  }

  importMatches(leagueShortcut: string, leagueSeason: string): Observable<ImportResult> {
    const params = new HttpParams()
      .set('leagueShortcut', leagueShortcut)
      .set('leagueSeason', leagueSeason);
    return this.http.post<ImportResult>(`${this.base}/matches/import`, null, { params });
  }

  leagueOptions(): Observable<LeagueOption[]> {
    return this.http.get<LeagueOption[]>(`${this.base}/leagues/options`);
  }

  leagues(page: number, size: number): Observable<PageRes<LeagueRow>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageRes<LeagueRow>>(`${this.base}/leagues`, { params });
  }

  matches(
    shortcut: string | null,
    season: string | null,
    page: number,
    size: number,
  ): Observable<PageRes<MatchRow>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (shortcut && season)
      params = params.set('leagueShortcut', shortcut).set('leagueSeason', season);
    return this.http.get<PageRes<MatchRow>>(`${this.base}/matches`, { params });
  }

  exportLeagues(): void {
    this.http
      .get(`${this.base}/leagues/export`, { responseType: 'blob' })
      .subscribe((b) => this.save(b, 'leagues.xlsx'));
  }

  exportMatches(shortcut: string | null, season: string | null): void {
    let params = new HttpParams();
    if (shortcut && season)
      params = params.set('leagueShortcut', shortcut).set('leagueSeason', season);
    this.http
      .get(`${this.base}/matches/export`, { params, responseType: 'blob' })
      .subscribe((b) => this.save(b, 'matches.xlsx'));
  }

  private save(blob: Blob, name: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
}
