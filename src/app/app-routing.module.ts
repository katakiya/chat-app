import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatAreaComponent } from './components/main-container/chat-area/chat-area.component';
import { ChatDefaultPageComponent } from './components/main-container/chat-area/chat-default-page/chat-default-page.component';
import { ChatRoomComponent } from './components/main-container/chat-area/chat-room/chat-room.component';
import { MainContainerComponent } from './components/main-container/main-container.component';
import { ChatGuard } from './guards/chat.guard';

const routes: Routes = [
    {
      path:'' , component:MainContainerComponent,
      children:[
        { 
           path:'room/:id', component:ChatRoomComponent
        },
        {
          path:'', component:ChatDefaultPageComponent
        }
      ],
      canActivate:[ChatGuard]
    },
    {
      path:'login' , component:LoginComponent
    },
    {
      path:'**', redirectTo:'login'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
