import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';
import { concatMap, map, reduce, switchMap, tap } from 'rxjs/operators';

const pb = new PocketBase(environment.API_URL);

@Injectable({
  providedIn: 'root',
})
export class PocketBaseService {
  authStateChanged$: BehaviorSubject<any>;

  constructor() {
    if (pb.authStore.model) {
      this.authStateChanged$ = new BehaviorSubject(pb.authStore.model);
    } else {
      this.authStateChanged$ = new BehaviorSubject(null);
    }
  }

  async signUp(email: string, password: string) {
    const data = {
      email,
      emailVisibility: true,
      password,
      passwordConfirm: password,
    };

    const record = await pb.collection('users').create(data);

    await pb
      .collection('users')
      .authWithPassword(email, password);

    this.authStateChanged$.next(pb.authStore.model);

    return record;
  }

  async signIn(email: string, password: string) {
    const authData = await pb
      .collection('users')
      .authWithPassword(email, password);

    this.authStateChanged$.next(pb.authStore.model);
    return pb.authStore.isValid;
  }

  signOut() {
    pb.authStore.clear();
    this.authStateChanged$.next(null);
  }

  getAllMessagesInCloud() {
    return pb.collection('note').getFullList(200 /* batch size */, {
      sort: '-created',
    });
  }

  deleteMessage(id) {
    return pb.collection('note').delete(id);
  }

  syncMessages(messages: Message[]) {
    const existingMessageDeletion$ = from(this.getAllMessagesInCloud()).pipe(
      tap((existingMessages: []) => console.log('loaded messages from cloud', existingMessages)),
      switchMap((existingMessages: []) => from(existingMessages)),
      concatMap((existingMessage: { id: string }) => this.deleteMessage(existingMessage.id)),
      reduce((acc, curr) => acc.concat(curr), []),
      tap(_ => console.log('deleted messages in cloud')),
    );

    return existingMessageDeletion$.pipe(
      tap(_ => console.log('starting upload of expenses')),
      switchMap(() => from(messages)),
      concatMap((message) => {
        const data = {
          main_message: message.main_message,
          favourite: message.favourite,
          soft_deleted: message.soft_deleted,
          message_owner: pb.authStore.model.id,
          created_time: message.created_at,
        };

        return from(pb.collection('note').create(data));
      }),
      reduce((acc, curr) => acc.concat(curr), []),
      tap(_ => console.log('deleted messages in cloud')),
    );
  }

  restoreMessages(): Observable<Message[]> {
    return from(this.getAllMessagesInCloud()).pipe(
      map((messages: []) =>
        messages.map((message: any) => ({
          id: message.id,
          created_at: new Date(message.created_time),
          favourite: message.favourite,
          soft_deleted: message.soft_deleted,
          main_message: message.main_message,
        }))
      )
    );
  }
}
