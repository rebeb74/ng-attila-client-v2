import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Checklist, Item } from '../../../shared/model/checklist.model';
import { ChecklistActions } from '../store/action-types';
import { ChecklistEntityService } from '../store/checklist-entity.service';
import { ChecklistState, getSelectedChecklist, getSelectedChecklistIsAnimated, getToggleChecklist } from '../store/checklist.reducer';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { AddChecklistComponent } from '../add-checklist/add-checklist.component';
import { AppState } from 'src/app/core/store/app.reducer';
import { getCurrentUser } from 'src/app/core/auth/store/auth.reducer';
import { EditChecklistComponent } from '../edit-checklist/edit-checklist.component';
import { ConfirmRemoveChecklistComponent } from '../confirm-remove-checklist/confirm-remove-checklist.component';

@Injectable()
export class ChecklistService {

  constructor(
    private checklistStore: Store<ChecklistState>,
    private cheklistEntityService: ChecklistEntityService,
    private dialog: MatDialog,
    private checklistEntityService: ChecklistEntityService,
    private store: Store<AppState>
  ) { }

  getToggleChecklist(): Observable<string> {
    return this.checklistStore.select(getToggleChecklist);
  }

  setToggleChecklist(toggleChecklist): void {
    this.checklistStore.dispatch(ChecklistActions.SetToggleChecklist({ toggleChecklist }));
  }

  getFilteredChecklists(): Observable<Checklist[]> {
    return this.getToggleChecklist()
      .pipe(
        switchMap((toggleChecklist) => this.getChecklists().pipe(
          map((checklists) => {
            let filteredChecklists = [];
            if (toggleChecklist === 'private') {
              filteredChecklists = checklists.filter((checklist) => checklist.friendShares.length === 0);
            } else if (toggleChecklist === 'public') {
              filteredChecklists = checklists.filter((checklist) => checklist.friendShares.length > 0);
            } else {
              filteredChecklists = checklists;
            }
            return filteredChecklists;
          }
          )
        ))
      );
  }

  getChecklists(): Observable<Checklist[]> {
    return this.checklistEntityService.entities$;
  }

  setSelectedChecklist(selectedChecklist: Checklist): void {
    this.selectedChecklistAnimationStart();
    this.checklistStore.dispatch(ChecklistActions.setSelectedChecklist({ selectedChecklist }));
    setTimeout(() => {
      document.getElementById('inputList').focus();
    }, 50);
    this.selectedChecklistAnimationStop();
  }

  getSelectedChecklist(): Observable<Checklist> {
    return this.checklistStore.select(getSelectedChecklist);
  }

  getSelectedChecklistItems(): Observable<Item[]> {
    return this.getSelectedChecklist()
      .pipe(
        mergeMap((selectedChecklist) => this.getFilteredChecklists().pipe(
          map((checklists) => {
            if (checklists.length > 0) {
              const checklist = checklists.find((c) => c._id === selectedChecklist._id);
              if (!checklist) {
                return null;
              } else {
                return checklist.items;
              }
            } else {
              return null;
            }
          })
        )),
      );
  }

  addChecklist(): Observable<boolean> {
    const addChecklist = this.dialog.open(AddChecklistComponent, {
      data: {
      }
    });
    return addChecklist.afterClosed()
      .pipe(
        withLatestFrom(this.store.select(getCurrentUser)),
        map(([checklist, currentUser]) => {
          if (!!checklist) {
            if (checklist.friendShares === '') {
              checklist.friendShares = [];
            }
            const newChecklist: Checklist = {
              checklistName: checklist.checklistName,
              userId: currentUser._id,
              username: currentUser.username,
              items: [],
              friendShares: checklist.friendShares,
              createdOn: new Date().toString()
            };
            this.checklistEntityService.add(newChecklist);
            return true;
          } else {
            return false;
          }
        }),
        first()
      );
  }

  editChecklist(checklist: Checklist): Observable<boolean> {
    const editChecklist = this.dialog.open(EditChecklistComponent, {
      data: {
        checklist
      }
    });
    return editChecklist.afterClosed()
      .pipe(
        map((editedChecklist) => {
          console.log(editedChecklist);
          if (!!editedChecklist) {
            if (editedChecklist.friendShares === '') {
              editedChecklist.friendShares = [];
            }
            this.checklistEntityService.update(editedChecklist);
            return true;
          } else {
            return false;
          }
        }),
        first()
      );
  }

  updateChecklist(checklist: Checklist) {
    this.cheklistEntityService.update(checklist);
  }

  removeChecklist(checklist: Checklist): Observable<boolean> {
    const confirmRemoveChecklist = this.dialog.open(ConfirmRemoveChecklistComponent, {
      data: {
        checklist
      }
    });
    return confirmRemoveChecklist.afterClosed()
      .pipe(
        switchMap((confirmRemoveChecklist) => this.getFilteredChecklists().pipe(
          map((checklists) => {
            if (confirmRemoveChecklist) {
              if (checklists.length > 1) {
                const index = checklists.findIndex((c) => checklist._id === c._id);
                if (index === 0) {
                  this.setSelectedChecklist(checklists[index + 1]);
                } else {
                  this.setSelectedChecklist(checklists[index - 1]);
                }
              }
              setTimeout(() => {
                this.cheklistEntityService.delete(checklist);
              }, 50);
              return true;
            } else {
              return false;
            }
          }),
          first()
        )),
      );

  }

  addItem(item: Item): Observable<boolean> {
    return this.getFilteredChecklists().pipe(
      withLatestFrom(this.getSelectedChecklist()),
      map(([checklists, selectedChecklist]) => {
        const updatedChecklist: Checklist = _.cloneDeep(checklists.find((checklist) => checklist._id === selectedChecklist._id));
        updatedChecklist.items = [...updatedChecklist.items, item];
        console.log('updatedChecklist', updatedChecklist);
        this.updateChecklist(updatedChecklist);
        return true;
      }),
      first()
    );
  }

  removeItem(item: Item): Observable<boolean> {
    return this.getFilteredChecklists().pipe(
      withLatestFrom(this.getSelectedChecklist()),
      map(([checklists, selectedChecklist]) => {
        const updatedChecklist: Checklist = _.cloneDeep(checklists.find((checklist) => checklist._id === selectedChecklist._id));
        const index = updatedChecklist.items.findIndex((i) => i.value === item.value);
        if (index >= 0) {
          updatedChecklist.items.splice(index, 1);
        }
        this.updateChecklist(updatedChecklist);
        return true;
      }),
      first()
    );
  }

  getSlectedChecklistAnimation(): Observable<boolean> {
    return this.checklistStore.select(getSelectedChecklistIsAnimated);
  }

  selectedChecklistAnimationStart() {
    this.checklistStore.dispatch(ChecklistActions.SelectedChecklistAnimationStart());
  }

  selectedChecklistAnimationStop() {
    setTimeout(() => {
      this.checklistStore.dispatch(ChecklistActions.SelectedChecklistAnimationStop());
    }, 500);
  }

}
