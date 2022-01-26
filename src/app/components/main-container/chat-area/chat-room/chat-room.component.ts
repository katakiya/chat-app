import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit , OnDestroy{

  msgsOfSender: any[] = [];
  msgsOfReceiver: any[] = [];
  allMsgs: any[] = [];
  subscriptions: Subscription[] = [];
  constructor(private service: CommonService) { }

  ngOnInit(): void {

    let currentUser = null;
    let selectedUser = null;

    this.subscriptions.push(
      this.service.selectedUser.subscribe(user => {
        selectedUser = user;

        this.service.currentUser.subscribe(user => {
          currentUser = user;
  
          this.service.getMessagesOfSender().subscribe(msgs => {
            this.allMsgs = this.allMsgs.filter(item => item.who === 'receiver')
            this.msgsOfSender = msgs;
            this.msgsOfSender.forEach(msg => {
              this.allMsgs.push(msg);
            })
    
            this.allMsgs.sort((a: any, b: any) => (a.time.seconds > b.time.seconds) ? 1 : ((b.time.seconds > a.time.seconds) ? -1 : 0));
          })
  
        })
        
        this.service.getMessagesOfReceiver().subscribe(msgs => {
          this.msgsOfReceiver = msgs;
          this.allMsgs = this.allMsgs.filter(item => item.who === 'sender')
          this.msgsOfReceiver.forEach(msg => {
            this.allMsgs.push(msg);
          })
          this.allMsgs.sort((a: any, b: any) => (a.time.seconds > b.time.seconds) ? 1 : ((b.time.seconds > a.time.seconds) ? -1 : 0));  
        })

      })
    )
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

}
