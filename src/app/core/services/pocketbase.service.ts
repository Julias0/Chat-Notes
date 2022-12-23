import { Injectable } from "@angular/core";
import PocketBase from "pocketbase";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

const pb = new PocketBase(environment.API_URL);

@Injectable({
  providedIn: "root",
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

    const record = await pb.collection("users").create(data);

    this.authStateChanged$.next(pb.authStore.model);

    return record;
  }

  async signIn(email: string, password: string) {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    this.authStateChanged$.next(pb.authStore.model);
    return pb.authStore.isValid;
  }

  signOut() {
    pb.authStore.clear();
    this.authStateChanged$.next(null);
  }
}
