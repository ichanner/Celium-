import { Service, Inject } from 'typedi';
import { Server } from 'socket.io';
import { RedisClientType } from 'redis';

@Service()
class EventDispatcher {
  constructor(
    @Inject('io') private io: Server,
    @Inject('pubClient') private pubClient: RedisClientType
  ) {}

  async emit(event: string, data: any) {

    this.io.emit(event, data);

    await this.pubClient.publish(event, JSON.stringify(data));
  }

  async emitTo(room: string, event: string, data: any) {

    this.io.to(room).emit(event, data);

    await this.pubClient.publish(event, JSON.stringify({ room, data }))
  }
}

export default EventDispatcher;
