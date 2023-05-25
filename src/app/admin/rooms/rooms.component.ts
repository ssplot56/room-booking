import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data.service";
import {Room} from "../../model/Room";
import {ActivatedRoute, Router} from "@angular/router";
import {FormResetService} from "../../form-reset.service";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  action: string;
  rooms: Array<Room>;
  selectedRoom : Room;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.dataService.getRooms().subscribe(
      (next) => {
        this.rooms = next;
      }
    );
    this.route.queryParams.subscribe(
      params => {
        // @ts-ignore
        this.action = null;
        const id = params['id'];
        if (id) {
          // @ts-ignore
          this.selectedRoom = this.rooms.find(room => room.id === +id);
          this.action = params['action'];
        }
        if (params['action'] === 'add') {
          this.selectedRoom = new Room();
          this.action = 'edit';
          this.formResetService.resetRoomFormEvent.emit(this.selectedRoom);
        }
      }
    );
  }

  setRoom(id: number) {
    this.router.navigate(['admin', 'rooms'], {queryParams : {id, 'action': 'view'}});
  }

  addRoom() {
    this.router.navigate(['admin', 'rooms'], {queryParams: {'action': 'add'}});
  }
}
