import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input, OnChanges } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject, concat, merge } from 'rxjs';
import { Message } from 'src/app/core/models/message.model';
import { map } from 'rxjs/internal/operators/map';
import { delay, startWith, tap, concatMap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { messageListType } from 'src/app/core/enums/messageListTypes.enum';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss'],
})
export class MessageContainerComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('messageContainer') messageContainer: ElementRef;
  @Input() filterElements = messageListType.normal;
  @Input() searchText = '';
  searchText$: BehaviorSubject<string> = new BehaviorSubject('');

  messages$: Observable<Message[]>;
  updateDom$: Subject<any> = new Subject();

  constructor(
    private searchService: SearchService
  ) { }

  calculateDiff(date1, date2) {
    date2 = new Date(date2);
    return Math.floor(
      (
        Date.UTC(
          date1.getFullYear(),
          date1.getMonth(),
          date1.getDate())
        -
        Date.UTC(
          date2.getFullYear(),
          date2.getMonth(),
          date2.getDate()
        )
      )
      /
      (1000 * 60 * 60 * 24));
  }

  scrollToBottom() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight + 100;
    } catch (error) {
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.searchText$.getValue() !== this.searchText) {
      this.searchText$.next(this.searchText);
    }
  }

  ngAfterViewInit() {
    const that = this;

    const searchFiltration$ = that.searchText$.pipe(
      switchMap((search) => that.searchService.searchByText(that.filterElements, search))
    );

    that.messages$ = merge(
      that.searchService.searchByText(that.filterElements, that.searchText),
      searchFiltration$
    ).pipe(
      startWith(new Array<Message>()),
      map(messages => messages
        .sort(
          (a, b) => a.created_at.valueOf() - b.created_at.valueOf()
        )
      )
    );

    that.messages$.pipe(
      concatMap((value, index) => {
        return of(value).pipe(delay(index < 1 ? 1000 : 200));
      }),
      distinctUntilChanged((prev, curr) => curr.length === prev.length)
    ).subscribe(() => {
      that.scrollToBottom();
    });

    that.scrollToBottom();
  }
}
