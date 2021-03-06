import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { EventEntityService } from '../store/event-entity.service';

@Injectable({
  providedIn: 'root'
})
export class EventResolver implements Resolve<boolean> {

  constructor(
    private eventEntityService: EventEntityService,
  ) { }

  resolve(): Observable<boolean> {
    const isUser = localStorage.getItem('user');
    if (!!isUser) {
      return this.eventEntityService.loaded$
        .pipe(
          tap((eventLoaded) => {
            if (!eventLoaded) {
              this.eventEntityService.getAll();
            }
          }),
          filter((eventLoaded) => !!eventLoaded),
          first()
        );
    } else {
      return of(false);
    }
  }
}

