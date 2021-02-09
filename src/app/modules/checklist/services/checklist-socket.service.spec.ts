import { TestBed } from '@angular/core/testing';

import { ChecklistSocketService } from './checklist-socket.service';

describe('ChecklistSocketService', () => {
  let service: ChecklistSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
