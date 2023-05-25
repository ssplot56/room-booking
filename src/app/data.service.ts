import {Injectable} from '@angular/core';
import {Layout, LayoutCapacity, Room} from "./model/Room";
import {User} from "./model/User";
import {Observable, of} from "rxjs";
import {Booking} from "./model/Booking";
import {formatDate} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private rooms : Array<Room>;
  private users : Array<User>;
  private bookings : Array<Booking>;

  getRooms() : Observable<Array<Room>> {
    return of(this.rooms);
  }

  getUsers() : Observable<Array<User>> {
    return of(this.users);
  }

  getBooking() : Observable<Array<Booking>> {
    return of(this.bookings);
  }

  updateUser(user: User) : Observable<User> {
    const originalUser= this.users.find(u => u.id === user.id);
    // @ts-ignore
    originalUser.name = user.name;
    // @ts-ignore
    return of(originalUser);
  }

  addUser(newUser: User, password: String) : Observable<User> {
    let id = 0;
    for (const user of this.users) {
      if (user.id > id) {
        id = user.id
      }
    }
    newUser.id = id + 1;
    this.users.push(newUser);
    return of(newUser);
  }

  updateRoom(room: Room) : Observable<Room> {
    const originalRoom = this.rooms.find(r => r.id === room.id);
    // @ts-ignore
    originalRoom.name = room.name;
    // @ts-ignore
    originalRoom.location = room.location;
    // @ts-ignore
    originalRoom.capacities = room.capacities;
    // @ts-ignore
    return of(originalRoom);
  }

  addRoom(newRoom: Room) : Observable<Room> {
    let id = 0;
    for (const room of this.rooms) {
      if (room.id > id) {
        id = room.id;
      }
    }
    newRoom.id = id + 1;
    this.rooms.push(newRoom);
    return of(newRoom);
  }

  deleteRoom(id: number): Observable<any> {
    const room = this.rooms.find(r => r.id === id);
    // @ts-ignore
    this.rooms.splice(this.rooms.indexOf(room), 1);
    return of(null);
  }

  deleteUser(id: number): Observable<any> {
    const user = this.users.find(u => u.id === id);
    // @ts-ignore
    this.users.splice(this.users.indexOf(user), 1);
    return of(null);
  }

  resetUserPassword(id: number): Observable<any> {
    return of(null);
  }

  constructor() {
    this.rooms = new Array<Room>();
    const room1 = new Room();
    room1.id = 1;
    room1.name = 'First room';
    room1.location = 'First floor';

    const capacity1 = new LayoutCapacity();
    capacity1.layout = Layout.THEATER;
    capacity1.capacity = 50;
    const capacity2= new LayoutCapacity();
    capacity2.layout = Layout.USHAPE;
    capacity2.capacity = 20;

    room1.capacities.push(capacity1, capacity2);

    const room2 = new Room();
    room2.id = 2;
    room2.name = 'Second room';
    room2.location = 'Second floor';

    const capacity3 = new LayoutCapacity();
    capacity3.layout = Layout.BOARD;
    capacity3.capacity = 25;
    const capacity4= new LayoutCapacity();
    capacity4.layout = Layout.USHAPE;
    capacity4.capacity = 30;
    room2.capacities.push(capacity3, capacity4);
    this.rooms.push(room1, room2);

    this.users = new Array<User>();
    const user1 = new User();
    user1.id = 1;
    user1.name = 'Oleksandr';

    const user2 = new User();
    user2.id = 2;
    user2.name = 'Karina';

    const user3 = new User();
    user3.id = 3;
    user3.name = 'Slavko';
    this.users.push(user1, user2, user3);

    const booking1 = new Booking();
    booking1.id = 1;
    booking1.room = room1;
    booking1.user = user1;
    booking1.layout = Layout.THEATER;
    booking1.title = 'For best day of your life'
    booking1.date = formatDate(new Date(), 'yyyy-MM-dd', 'en-GB');
    booking1.startTime = '9:00';
    booking1.endTime = '21:00';
    booking1.participants = 2;

    const booking2 = new Booking();
    booking2.id = 2;
    booking2.room = room2;
    booking2.user = user2;
    booking2.layout = Layout.USHAPE;
    booking2.title = 'For good weekends';
    booking2.date = formatDate(new Date(), 'yyyy-MM-dd', 'en-GB');
    booking2.startTime = '11:30';
    booking2.endTime = '18:00';
    booking2.participants = 10;

    this.bookings = new Array<Booking>;
    this.bookings.push(booking1, booking2);
  }
}
