import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sidebar-content',
  templateUrl: './sidebar-content.component.html',
  styleUrls: ['./sidebar-content.component.scss']
})
export class SidebarContentComponent implements OnInit {

  users: any[] = [];
  currentUser: any = null;
  constructor(private service: CommonService) {
    this.service.getAllUsers().subscribe(users => {
      this.users = users;
      this.service.currentUser.subscribe(user => {
        let userStr = localStorage.getItem('user');
        if (userStr)
          this.currentUser = JSON.parse(userStr);

        if (this.users && this.currentUser) {
          this.users = this.users.filter(user => user.id != this.currentUser.id);
        }

      })
    })
  }


  ngOnInit(): void {

  }

  selectUser(user: any) {
    this.service.setSelectedUser(user);
  }

}
