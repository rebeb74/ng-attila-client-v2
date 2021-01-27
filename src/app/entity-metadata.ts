import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';
import { User } from './shared/model/user.model';
import { Notification } from "./shared/model/notification.model";
import { Event } from "./calendar/model/event.model";


export const entityMetadata: EntityMetadataMap = {
  User: {
    selectId: (user: User) => user._id
  },
  Notification: {
    selectId: (notification: Notification) => notification._id
  },
  Event: {
    selectId: (event: Event) => event._id
  }
};

const pluralNames = {  };

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};
