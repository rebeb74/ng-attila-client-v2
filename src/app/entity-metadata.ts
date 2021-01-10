import { EntityMetadataMap, EntityDataModuleConfig } from '@ngrx/data';
import { User } from './shared/model/user.model';

export const entityMetadata: EntityMetadataMap = {
  User: {
    selectId: (user: User) => user._id
  }
};

const pluralNames = {  };

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};
