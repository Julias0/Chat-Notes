import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { MessagesService } from 'src/app/core/services/messages.service';
import { Observable, Subject, of } from 'rxjs';
import { Message } from 'src/app/core/models/message.model';
import { map } from 'rxjs/internal/operators/map';
import { delay, startWith, tap, concatMap, distinctUntilChanged } from 'rxjs/operators';
import { messageListType } from 'src/app/core/enums/messageListTypes.enum';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss'],
})
export class MessageContainerComponent implements OnInit, AfterViewInit {

  @ViewChild('messageContainer') messageContainer: ElementRef;
  @Input() filterElements = messageListType.normal;

  messages$: Observable<Message[]>;
  updateDom$: Subject<any> = new Subject();

  constructor(
    private messageService: MessagesService
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

  ngAfterViewInit() {
    const that = this;
    that.messages$ = that.messageService.getMyMessages().pipe(
      startWith(new Array<Message>()),
      map(messages => {
        if (that.filterElements === messageListType.normal) {
          return messages.filter(message => !message.soft_deleted);
        } else if (that.filterElements === messageListType.deleted) {
          return messages.filter(message => message.soft_deleted);
        } else if (that.filterElements === messageListType.favourites) {
          return messages.filter(message => message.favourite);
        } else {
          return messages;
        }
      }),
      map(messages => messages
        .sort(
          (a, b) => a.created_at.valueOf() - b.created_at.valueOf()
        )
      ),
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
