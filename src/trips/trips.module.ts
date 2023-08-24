import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsResolver } from './trips.resolver';

@Module({
  providers: [TripsResolver, TripsService],
})
export class TripsModule {}
