import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild, ViewContainerRef
} from '@angular/core';
import { SwipeServiceService } from '../swipe-service.service';
import { Event } from '../../model/event.model';

@Component({
  selector: 'sw-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements AfterViewInit {
  alive = true;
  result: boolean;
  opened: boolean;
  selfElement = null;
  idElement = null;
  @Input() inside: Event;

  @Input('disable-mark') disabledMark = false;

  @Input('show-mark') showMark = false;

  @Input('item-class') itemClass = '';

  @ViewChild('defaultEdit') defaultEdit: TemplateRef<any>;
  @ViewChild('defaultTrash') defaultTrash: TemplateRef<any>;

  @ViewChild('defaultMark') defaultMark: TemplateRef<any>;
  @ViewChild('defaultNotMark') defaultNotMark: TemplateRef<any>;
  @ViewChild('defaultCustom') defaultCustom: TemplateRef<any>;

  @Input('customTemplate') customTemplate: TemplateRef<any>;
  @Input('editTemplate') editTemplate: TemplateRef<any>;
  @Input('trashTemplate') trashTemplate: TemplateRef<any>;
  @Input('markTemplate') markTemplate: TemplateRef<any>;
  @Input('notMarkTemplate') notMarkTemplate: TemplateRef<any>;

  @Output()
  callback = new EventEmitter<any>();

  @Output()
  swClick = new EventEmitter<any>();

  @ViewChild('viewContainerEdit', { static: false, read: ViewContainerRef })
  viewContainerEdit: ViewContainerRef;

  @ViewChild('viewContainerTrash', { static: false, read: ViewContainerRef })
  viewContainerTrash: ViewContainerRef;

  @ViewChild('viewContainerMark', { static: false, read: ViewContainerRef })
  viewContainerMark: ViewContainerRef;

  @ViewChild('viewContainerCustom', { static: false, read: ViewContainerRef })
  viewContainerCustom: ViewContainerRef;


  @HostListener('document:click', ['$event'])
  clickOut(event) {
    if (!this.selfElement.contains(event.target)) {
      this.result = false;
      this.opened = false;
    }
  }

  constructor(elRef: ElementRef, private swService: SwipeServiceService) {
    this.selfElement = elRef.nativeElement;
    this.idElement = `list-swipe-${this.random()}`;
    this.selfElement.setAttribute('data-id', this.idElement);
    this.selfElement.id = this.idElement;
    this.swService.swipeObserver.subscribe((a) => {
      if (a !== this.selfElement.id) {
        this.result = false;
        this.opened = false;
      }
    });
  }

  private random = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  public swipeleft = (res: any) => {
    this.swService.closeAll(this.selfElement.id);
    if (!this.disabledMark) {
      this.result = (res.deltaX < 0);
      setTimeout(() => {
        this.opened = (res.deltaX < 0);
      }, 200);
    }
  }

  clickItem = (a: any) => this.swClick.emit(a);

  action = (opt = '') => {
    try {
      this.result = false;
      this.opened = false;
      if (opt === 'repeat') {
        this.callback.emit({ action: 'repeat', value: this.inside });
      } else if (opt === 'trash') {
        this.callback.emit({ action: 'trash', value: this.inside });
      }
    } catch (e) {
      console.log('Debes definir ID de edit, y trash');
    }
  };

  ngAfterViewInit(): void {

    // if (this.showMark) {
    //   if (this.inside.mark && !this.markTemplate) {
    //     const viewMark = this.defaultMark.createEmbeddedView(null);
    //     this.viewContainerMark.insert(viewMark);
    //   } else if (this.inside.mark && this.markTemplate) {
    //     const viewMark = this.markTemplate.createEmbeddedView(null);
    //     this.viewContainerMark.insert(viewMark);
    //   }

    //   if (!this.inside.mark && !this.notMarkTemplate) {
    //     const viewMark = this.defaultNotMark.createEmbeddedView(null);
    //     this.viewContainerMark.insert(viewMark);
    //   } else if (!this.inside.mark && this.notMarkTemplate) {
    //     const viewMark = this.notMarkTemplate.createEmbeddedView(null);
    //     this.viewContainerMark.insert(viewMark);
    //   }
    // }

    if (this.trashTemplate) {
      const viewTrash = this.trashTemplate.createEmbeddedView(null);
      if (this.viewContainerTrash) {
        this.viewContainerTrash.insert(viewTrash);
      }
    } else if (this.trashTemplate !== null) {
      const viewTrash = this.defaultTrash.createEmbeddedView(null);
      this.viewContainerTrash.insert(viewTrash);
    }

    if (this.editTemplate) {
      const viewEdit = this.editTemplate.createEmbeddedView(null);
      if (this.viewContainerEdit) {
        this.viewContainerEdit.insert(viewEdit);
      }
    } else if (this.editTemplate !== null) {
      const viewEdit = this.defaultEdit.createEmbeddedView(null);
      this.viewContainerEdit.insert(viewEdit);
    }

    setTimeout(() => {
      if (this.customTemplate) { // Si tiene
        const dataInside = { ...this.inside, ...{ touch: this.selfElement.id } };
        const viewCustomTemplate = this.customTemplate.createEmbeddedView({
          item: dataInside,
          id: this.selfElement.id
        });
        if (viewCustomTemplate && viewCustomTemplate.rootNodes) {
          viewCustomTemplate.rootNodes.map((e) => {
            e.id = this.selfElement.id;
            e.children[0].childNodes.forEach((b) => {
              if (b) {
                b.id = this.selfElement.id;
                if (b.children.length) {
                  b.children[0].id = this.selfElement.id;
                }
              }
            });
          });
        }

        if (viewCustomTemplate) {
          this.viewContainerCustom.insert(viewCustomTemplate);
        }
      } else {
        const viewCustomTemplate = this.defaultCustom.createEmbeddedView(null);
        this.viewContainerCustom.insert(viewCustomTemplate);
      }
    }, 50);

  }

}
