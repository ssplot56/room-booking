import {Component, Input, OnInit} from '@angular/core';
import {Booking} from "../../model/Booking";
import {DataService} from "../../data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Layout, Room} from "../../model/Room";
import {User} from "../../model/User";

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.component.html',
  styleUrls: ['./booking-edit.component.css']
})
export class BookingEditComponent implements OnInit {
  booking: Booking;
  rooms: Array<Room>;
  users: Array<User>;
  layouts = Object.values(Layout);
  layoutEnum = Layout;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.dataService.getRooms().subscribe(
      next => this.rooms = next
    );
    this.dataService.getUsers().subscribe(
      next => this.users = next
    );

    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.dataService.getBooking(+id).subscribe(
        next => this.booking = next
      )
    } else {
      this.booking = new Booking();
    }
  }

  onSubmit() {
    if (this.booking.id != null) {
      this.dataService.saveBooking(this.booking).subscribe(
        next =>
          this.router.navigate([''])
      )
    } else {
      this.dataService.addBooking(this.booking).subscribe(
        next =>
          this.router.navigate([''])
      )
    }
  }
}
