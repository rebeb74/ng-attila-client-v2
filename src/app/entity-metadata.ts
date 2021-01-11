import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';
import { User } from './shared/model/user.model';
import { Notification } from "./shared/model/notification.model";


export const entityMetadata: EntityMetadataMap = {
  User: {
    selectId: (user: User) => user._id
  },
  Notification: {
    selectId: (notification: Notification) => notification._id
  }
};

const pluralNames = {  };

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};
