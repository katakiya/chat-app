import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {

  user: any = null;
  constructor(private service: CommonService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.service.selectedUser.subscribe(user => {
      this.user = user;
    })
  }

  onSubmit(form: NgForm) {
    this.service.sendMessage(form.value?.message);
    form.reset();
  }




}
