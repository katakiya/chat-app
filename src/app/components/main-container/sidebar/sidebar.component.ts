import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentUser: any = null;
  constructor(private service: CommonService) { }

  ngOnInit(): void {
    let userStr = localStorage.getItem('user');
    if (userStr)
      this.currentUser = JSON.parse(userStr);
  }

  onSubmit(form: NgForm) {
    console.log(form.value.search);
  }

  logout() {
    this.service.logout();
  }
}
