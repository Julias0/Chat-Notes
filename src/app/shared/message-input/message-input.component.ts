import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { fromEvent, noop, merge, concat } from 'rxjs';
import { map, filter, tap, concatMap, mergeMap, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from 'src/app/core/services/messages.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent implements OnInit, AfterViewInit {
  @ViewChild('addMessage') addMessageBtn;
  @ViewChild('messageInput') messageInput;
  fg: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService
  ) { }

  ngOnInit() {
    this.fg = this.formBuilder.group({
      currentMessage: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // const inputEnterKeyup$ = fromEvent<any>(this.messageInput.el, 'keyup')
    //   .pipe(
    //     filter(event => event.key === 'Enter')
    //   );
    const sendButtonClick$ = fromEvent(this.addMessageBtn.el, 'click');

    // const messageSend$ = merge(inputEnterKeyup$, sendButtonClick$)
    const messageSend$ = merge(sendButtonClick$)
      .pipe(
        filter(() => this.fg.controls.currentMessage.valid),
        map(() => this.fg.controls.currentMessage.value),
        tap(console.log),
        tap(() => this.fg.controls.currentMessage.reset()),
        switchMap((message) => {
          return this.messagesService.addMessage(message);
        })
      );

    messageSend$.subscribe(noop);
  }
}
