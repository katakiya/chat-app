import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import firebase from 'firebase/compat/app';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  selectedUser = new BehaviorSubject<any>(null);
  currentUser = new BehaviorSubject<any>(null);

  constructor(private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router) {
    this.selectedUser.next(null);
  }


  // login
  loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(data => {
        if (data.user) {
          let loggedInUser = {
            id: data.user.uid,
            displayName: data.user.displayName,
            photoURL: data.user.photoURL
          }
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          this.currentUser.next(loggedInUser);
          let ref = this.firestore.doc('users/' + data.user.uid).ref;
          ref.set(loggedInUser);
          this.router.navigateByUrl('').then();
        } else {
          localStorage.setItem('user', 'null');
        }
      })
      .catch(err => {
        alert('---error in login---' + err);
      })
  }

  //logout
  logout() {
    this.auth.signOut().then(result => {
      this.currentUser.next(null);
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login').then();
    })
  }

  //getAllUsers
  getAllUsers() {
    return this.firestore.collection('users').valueChanges()
  }

  //setSelectedUser
  setSelectedUser(user: any) {
    //this.selectedUser = new BehaviorSubject<any>(null);
    this.selectedUser.next(user);
  }


  // store Message
  sendMessage(msg: string) {
    let sender: any = null;
    let userStr = localStorage.getItem('user');
    if (userStr)
      sender = JSON.parse(userStr);
    let receiver: any = null;
    this.selectedUser.subscribe(user => {
      receiver = user;
    });

    if (sender && receiver) {
      let newMsg = {
        'message': msg,
        'sender': sender?.id,
        'time': new Date()
      };
      this.firestore.collection('messages/' + receiver.id + '/msgList').add(newMsg);
    }

  }


  // get messages of sender
  getMessagesOfSender() {
    let receiver: any = null;
    let sender: any = null;
    this.selectedUser.subscribe(user => {
      receiver = user;
    });

    let userStr = localStorage.getItem('user');
    if (userStr)
      sender = JSON.parse(userStr);

    if (receiver) {
      return this.firestore.collection('messages/' + receiver?.id + '/msgList').valueChanges()
        .pipe(
          map((val: any) => {
            val = val.filter((msg: any) => msg['sender'] == sender.id);
            val.forEach((element: any) => {
              element.who = 'sender';
              return element;
            });
            return val;
          })
        )
    } else {
      return of([]);
    }
  }

  // get messages of receiver
  getMessagesOfReceiver() {
    let sender: any = null;
    let receiver: any = null;

    let userStr = localStorage.getItem('user');
    if (userStr)
      sender = JSON.parse(userStr);

    this.selectedUser.subscribe(user => {
      receiver = user;
    });

    if (sender) {
      return this.firestore.collection('messages/' + sender?.id + '/msgList').valueChanges()
        .pipe(
          map((val: any) => {
            val = val.filter((msg: any) => msg['sender'] == receiver.id);
            val.forEach((element: any) => {
              element.who = 'receiver';
              return element;
            });
            return val;
          })
        )
    } else {
      return of([]);
    }

  }


}
