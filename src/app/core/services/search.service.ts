import { Injectable } from '@angular/core';
import { MessagesService } from './messages.service';
import { messageListType } from '../enums/messageListTypes.enum';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private messagesService: MessagesService
  ) { }

  searchByText(msgType: messageListType, searchText: string) {
    return this.messagesService.getMyMessages()
      .pipe(
        map(messages => {
          if (msgType === messageListType.normal) {
            return messages.filter(message => !message.soft_deleted);
          } else if (msgType === messageListType.deleted) {
            return messages.filter(message => message.soft_deleted);
          } else if (msgType === messageListType.favourites) {
            return messages.filter(message => message.favourite);
          } else {
            return messages;
          }
        }),
        map(messages => {
          if (searchText) {
            return messages.filter(message => message.main_message.toLowerCase().includes(searchText.toLowerCase()));
          }
          return messages;
        })
      );

  }
}
