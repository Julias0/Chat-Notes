import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.model';
import { filter, map } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private messages = new BehaviorSubject<Message[]>([]);

  constructor(
    private storageService: StorageService
  ) {
    const that = this;
    that.storageService.get('my_messages').then((messages) => {
      if (messages) {

        that.messages.next(messages.map(message => ({
          ...message,
          created_at: new Date(message.created_at)
        })));
      }
    });
  }

  getMyMessages() {
    return this.messages.asObservable();
  }

  addMessage(messageBody: string) {
    const that = this;
    const currentMessages = this.messages.getValue();
    currentMessages.push({
      id: (currentMessages.length + 1).toString(),
      created_at: new Date(),
      favourite: false,
      soft_deleted: false,
      main_message: messageBody
    });

    that.storageService.set('my_messages', currentMessages).then(() =>{
      this.messages.next(currentMessages);
    });

    return this.getMyMessages();
  }

  deleteMessage(messageId) {
    const that = this;
    const currentMessages = that.messages.getValue();
    const message = currentMessages.find(currentMessage => currentMessage.id === messageId);
    message.soft_deleted = true;
    const modifiedMessages = currentMessages.filter(currentMessage => currentMessage.id !== messageId);
    modifiedMessages.push(message);

    that.storageService.set('my_messages', modifiedMessages).then(() =>{
      that.messages.next(modifiedMessages);
    });

    return that.getMyMessages();
  }

  restoreMessage(messageId) {
    const that = this;
    const currentMessages = that.messages.getValue();
    const message = currentMessages.find(currentMessage => currentMessage.id === messageId);
    message.soft_deleted = false;
    const modifiedMessages = currentMessages.filter(currentMessage => currentMessage.id !== messageId);
    modifiedMessages.push(message);

    that.storageService.set('my_messages', modifiedMessages).then(() =>{
      that.messages.next(modifiedMessages);
    });

    return that.getMyMessages();
  }

  favouriteMessage(messageId) {
    const that = this;
    const currentMessages = that.messages.getValue();
    const message = currentMessages.find(currentMessage => currentMessage.id === messageId);
    message.favourite = !message.favourite;
    const modifiedMessages = currentMessages.filter(currentMessage => currentMessage.id !== messageId);
    modifiedMessages.push(message);

    that.storageService.set('my_messages', modifiedMessages).then(() => {
      that.messages.next(modifiedMessages);
    });

    return that.getMyMessages();
  }
}
