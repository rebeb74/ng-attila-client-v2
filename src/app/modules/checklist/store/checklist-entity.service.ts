import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Checklist } from '../../../shared/model/checklist.model';

@Injectable()
export class ChecklistEntityService extends EntityCollectionServiceBase<Checklist> {


    constructor(
        serviceElementsFactory: EntityCollectionServiceElementsFactory
    ) {

        super('Checklist', serviceElementsFactory);
    }
}
