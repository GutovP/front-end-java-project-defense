import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { UserService } from './user/user.service';
import { interval } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'java-front-end';

  ngOnInit(): void {}

  
}
