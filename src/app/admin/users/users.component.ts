import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {DataService} from "../../data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {FormResetService} from "../../form-reset.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Array<User>;
  selectedUser: User;
  action: string;
  loadingData = true;
  message = 'Please wait...';
  reloadAttempts = 0;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService) {
  }

  loadData() {
    this.dataService.getUsers().subscribe(
      (next) => {
        this.users = next;
        this.loadingData = false;
        this.processUrlParams();
      },
      error => {
        if (error.status === 402) {
          this.message = 'Sorry - you need to pay to use this application.';
        } else {
          this.reloadAttempts++;
          if (this.reloadAttempts <= 10) {
            this.message = 'Sorry, something went wrong. Trying again... please wait.';
            this.loadData();
          } else {
            this.message = 'Sorry, something went wrong. Please, contact support.';
          }
        }
        console.log('error', error);
      }
    );
  }

  processUrlParams() {
    this.route.queryParams.subscribe(
      params => {
        const id = params['id'];
        this.action = params['action'];
        if (id) {
          // @ts-ignore
          this.selectedUser = this.users.find(user => user.id === +id);
        }
      }
    )
  }

  ngOnInit(): void {
    this.loadData();
  }

  setUser(id: number) {
    this.router.navigate(['admin', 'users'], {queryParams : {id, action : 'view'}});
  }

  addUser() {
    this.selectedUser = new User();
    this.router.navigate(['admin', 'users'], {queryParams : {action : 'add'}});
    this.formResetService.resetUserFormEvent.emit(this.selectedUser);
  }
}
