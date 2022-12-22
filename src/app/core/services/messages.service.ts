import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { filter, map } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private messages = new BehaviorSubject<Message[]>([]);
  private ephemeralMessages = new BehaviorSubject<Message>(null);
  private setCurrentMessage = new Subject<string>();

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

  addEphmeralMessage(messageBody: string) {
    const that = this;
    that.ephemeralMessages.next({
      id: '1',
      created_at: new Date(),
      favourite: false,
      soft_deleted: false,
      main_message: messageBody
    });

    return that.getMyMessages();
  }

  getEphemeralMessage() {
    const that = this;
    return that.ephemeralMessages.asObservable();
  }

  getMyMessages() {
    return this.messages.asObservable();
  }

  getSetCurrentMessage() {
    return this.setCurrentMessage.asObservable();
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

    that.ephemeralMessages.next(null);

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

  copyMessage(messageId) {
    const that = this;
    const currentMessages = that.messages.getValue();
    const message = currentMessages.find(currentMessage => currentMessage.id === messageId);
   
    this.setCurrentMessage.next(message.main_message);
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
