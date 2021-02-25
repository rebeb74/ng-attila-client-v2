import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';
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
import { UIService } from 'src/app/shared/services/ui.service';
import { User } from 'src/app/shared/model/user.model';
import { UserEntityService } from 'src/app/shared/services/user-entity.service';

@Injectable()
export class ChecklistService {

  constructor(
    private checklistStore: Store<ChecklistState>,
    private cheklistEntityService: ChecklistEntityService,
    private dialog: MatDialog,
    private checklistEntityService: ChecklistEntityService,
    private store: Store<AppState>,
    private uiService: UIService,
    private userEntityService: UserEntityService
  ) { }

  setSelectedChecklist(selectedChecklist: Checklist): void {
    this.selectedChecklistAnimationStart();
    this.checklistStore.dispatch(ChecklistActions.setSelectedChecklist({ selectedChecklist }));
    setTimeout(() => {
      document.getElementById('inputList').focus();
    }, 100);
    this.selectedChecklistAnimationStop();
  }

  setToggleChecklist(toggleChecklist): void {
    this.checklistStore.dispatch(ChecklistActions.SetToggleChecklist({ toggleChecklist }));
  }

  getChecklists(): Observable<Checklist[]> {
    return this.checklistEntityService.entities$
      .pipe(
        withLatestFrom(this.userEntityService.entities$),
        map(([checklists, users]) => {
          let newChecklists: Checklist[] = [];
          checklists.forEach((checklist) => {
            const checklistOwner = users.find((user) => user._id === checklist.userId);
            checklist = {
              ...checklist,
              username: checklistOwner.username
            };
            newChecklists = [...newChecklists, checklist];
          });
          return newChecklists;
        })
      );
  }

  getFilteredChecklists(): Observable<Checklist[]> {
    return this.getToggleChecklist()
      .pipe(
        switchMap((toggleChecklist) => this.getChecklists().pipe(
          withLatestFrom(this.store.select(getCurrentUser)),
          map(([checklists, currentUser]) => {
            let filteredChecklists = [];
            if (toggleChecklist === 'myChecklists') {
              filteredChecklists = checklists.filter((checklist) => checklist.userId === currentUser._id);
            } else {
              filteredChecklists = checklists;
            }
            return filteredChecklists;
          }
          )
        ))
      );
  }

  getSelectedChecklist(): Observable<Checklist> {
    return this.checklistStore.select(getSelectedChecklist)
      .pipe(
        switchMap((selectedChecklist) => this.getFilteredChecklists().pipe(
          map((checklists) => {
            if (checklists.length > 0) {
              const checklist = checklists.find((c) => c._id === selectedChecklist._id);
              if (!checklist) {
                return null;
              } else {
                return checklist;
              }
            } else {
              return null;
            }
          })
        )),
      );
  }

  getSelectedChecklistItems(): Observable<Item[]> {
    return this.getSelectedChecklist()
      .pipe(
        map((selectedChecklist) => {
          if (selectedChecklist) {
            return selectedChecklist.items;
          } else {
            return null;
          }
        })
      );
  }

  getToggleChecklist(): Observable<string> {
    return this.checklistStore.select(getToggleChecklist);
  }

  selectedChecklistAnimationStart(): void {
    this.checklistStore.dispatch(ChecklistActions.SelectedChecklistAnimationStart());
  }

  selectedChecklistAnimationStop(): void {
    setTimeout(() => {
      this.checklistStore.dispatch(ChecklistActions.SelectedChecklistAnimationStop());
    }, 500);
  }

  getSlectedChecklistAnimation(): Observable<boolean> {
    return this.checklistStore.select(getSelectedChecklistIsAnimated);
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
            } else {
              checklist.friendShares.forEach((friend) => {
                this.uiService.addNotification(friend.userId, currentUser._id, 'new_shared_checklist', [checklist.checklistName]);
              });
            }
            const newChecklist: Checklist = {
              checklistName: checklist.checklistName,
              userId: currentUser._id,
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
        withLatestFrom(this.getSelectedChecklist(), this.getFilteredChecklists(), this.store.select(getCurrentUser), this.getToggleChecklist()),
        map(([editedChecklist, selectedChecklist, checklists, currentUser, toggleSelected]: [Checklist, Checklist, Checklist[], User, string]) => {
          if (!!editedChecklist) {

            if (currentUser._id === editedChecklist.userId) {
              const removedShareFriends = selectedChecklist.friendShares.filter((selectedChecklistFriend) => !editedChecklist.friendShares.find((editedChecklistFriend) => selectedChecklistFriend.userId === editedChecklistFriend.userId));
              removedShareFriends.forEach((friend) => {
                this.uiService.addNotification(friend.userId, currentUser._id, 'removed_shared_checklist', [selectedChecklist.checklistName]);
              });

              const addedShareFriends = editedChecklist.friendShares.filter((editedChecklistFriend) => !selectedChecklist.friendShares.find((selectedChecklistFriend) => editedChecklistFriend.userId === selectedChecklistFriend.userId));
              addedShareFriends.forEach((friend) => {
                this.uiService.addNotification(friend.userId, currentUser._id, 'new_shared_checklist', [selectedChecklist.checklistName]);
              });
            }

            if (selectedChecklist.checklistName !== editedChecklist.checklistName) {
              selectedChecklist.friendShares.forEach((friend) => {
                if (friend.userId !== currentUser._id) {
                  this.uiService.addNotification(friend.userId, currentUser._id, 'checklist_name_updated', [selectedChecklist.checklistName, editedChecklist.checklistName]);
                }
              });
            }

            if (toggleSelected === 'private' && editedChecklist.friendShares.length > 0) {
              if (checklists.length > 1) {
                const index = checklists.findIndex((c) => checklist._id === c._id);
                if (index === 0) {
                  this.setSelectedChecklist(checklists[index + 1]);
                } else {
                  this.setSelectedChecklist(checklists[index - 1]);
                }
              }
            } else if (toggleSelected === 'public' && editedChecklist.friendShares.length === 0) {
              if (checklists.length > 1) {
                const index = checklists.findIndex((c) => checklist._id === c._id);
                if (index === 0) {
                  this.setSelectedChecklist(checklists[index + 1]);
                } else {
                  this.setSelectedChecklist(checklists[index - 1]);
                }
              }
            }

            this.updateChecklist(editedChecklist);
            return true;
          } else {
            return false;
          }
        }),
        first()
      );
  }

  updateChecklist(checklist: Checklist): void {
    this.cheklistEntityService.update(checklist);
  }

  removeChecklist(removedChecklist: Checklist): Observable<boolean> {
    const confirmRemoveChecklist = this.dialog.open(ConfirmRemoveChecklistComponent, {
      data: {
        removedChecklist
      }
    });
    return confirmRemoveChecklist.afterClosed()
      .pipe(
        withLatestFrom(this.getFilteredChecklists(), this.store.select(getCurrentUser)),
        map(([confirmRemoveChecklist, filteredChecklists, currentUser]: [Checklist, Checklist[], User]) => {
          if (confirmRemoveChecklist) {
            if (filteredChecklists.length > 1) {
              const index = filteredChecklists.findIndex((c) => removedChecklist._id === c._id);
              if (index === 0) {
                this.setSelectedChecklist(filteredChecklists[index + 1]);
              } else {
                this.setSelectedChecklist(filteredChecklists[index - 1]);
              }
            }

            if (removedChecklist.friendShares.length > 0) {
              removedChecklist.friendShares.forEach((friend) => {
                this.uiService.addNotification(friend.userId, currentUser._id, 'removed_checklist', [removedChecklist.checklistName]);
              });
            }

            setTimeout(() => {
              this.cheklistEntityService.delete(removedChecklist);
            }, 50);

            return true;
          } else {
            return false;
          }
        }),
        first()
      );

  }

  addItem(item: Item): Observable<boolean> {
    return this.getFilteredChecklists().pipe(
      withLatestFrom(this.getSelectedChecklist()),
      map(([checklists, selectedChecklist]) => {
        const updatedChecklist: Checklist = _.cloneDeep(checklists.find((checklist) => checklist._id === selectedChecklist._id));
        updatedChecklist.items = [...updatedChecklist.items, item];
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

}
