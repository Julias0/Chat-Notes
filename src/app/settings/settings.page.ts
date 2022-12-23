import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Message } from '../core/models/message.model';
import { MessagesService } from '../core/services/messages.service';
import { PocketBaseService } from '../core/services/pocketbase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private messagesService: MessagesService,
    private pocketBaseService: PocketBaseService,
  ) { }

  ngOnInit() {
  }

  syncMessages() {
    console.log('syncMessages');
    this.messagesService.getMyMessages().pipe(
      switchMap((messages: Message[]) => this.pocketBaseService.syncMessages(messages))
    ).subscribe(console.log);
  }

  restoreMessages() {
    this.pocketBaseService.restoreMessages().subscribe(messages => {
      this.messagesService.restoreMessages(messages);
    })
  }
}
