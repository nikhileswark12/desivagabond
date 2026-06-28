import {
  Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards, Patch, Query
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { PaginationDto } from '../shared/dto/pagination.dto';

@ApiTags('Trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private svc: TripsService) {}

  // ── Trips ──────────────────────────────────
  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.svc.createTrip(req.user.sub, body);
  }

  @Get()
  list(@Request() req: any, @Query() pagination: PaginationDto) {
    return this.svc.getTrips(req.user.sub, pagination.page, pagination.limit);
  }

  @Get(':id')
  get(@Param('id') id: string, @Request() req: any) {
    return this.svc.getTrip(id, req.user.sub);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() body: any) {
    return this.svc.updateTrip(id, req.user.sub, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.svc.deleteTrip(id, req.user.sub);
  }

  @Patch(':id/share')
  share(@Param('id') id: string, @Request() req: any, @Body() body: { isPublic: boolean }) {
    return this.svc.shareTrip(id, req.user.sub, body.isPublic);
  }

  // ── Stops ──────────────────────────────────
  @Post(':id/stops')
  addStop(@Param('id') tripId: string, @Request() req: any, @Body() body: any) {
    return this.svc.addStop(tripId, req.user.sub, body);
  }

  @Put(':id/stops/:stopId')
  updateStop(@Param('id') tripId: string, @Param('stopId') stopId: string, @Request() req: any, @Body() body: any) {
    return this.svc.updateStop(tripId, stopId, req.user.sub, body);
  }

  @Delete(':id/stops/:stopId')
  deleteStop(@Param('id') tripId: string, @Param('stopId') stopId: string, @Request() req: any) {
    return this.svc.deleteStop(tripId, stopId, req.user.sub);
  }

  @Patch(':id/stops/reorder')
  reorderStops(@Param('id') tripId: string, @Request() req: any, @Body() body: { stopIds: string[] }) {
    return this.svc.reorderStops(tripId, req.user.sub, body.stopIds);
  }

  @Post(':id/stops/:stopId/activities')
  addActivityToStop(@Param('id') tripId: string, @Param('stopId') stopId: string, @Request() req: any, @Body() body: { activityId: string }) {
    return this.svc.addActivityToStop(tripId, stopId, body.activityId, req.user.sub);
  }

  @Delete(':id/stops/:stopId/activities/:activityId')
  removeActivityFromStop(@Param('id') tripId: string, @Param('stopId') stopId: string, @Param('activityId') activityId: string, @Request() req: any) {
    return this.svc.removeActivityFromStop(tripId, stopId, activityId, req.user.sub);
  }

  // ── Budget ─────────────────────────────────
  @Get(':id/budget')
  getBudget(@Param('id') tripId: string, @Request() req: any) {
    return this.svc.getBudget(tripId, req.user.sub);
  }

  @Post(':id/budget')
  addBudgetItem(@Param('id') tripId: string, @Request() req: any, @Body() body: any) {
    return this.svc.addBudgetItem(tripId, req.user.sub, body);
  }

  @Delete(':id/budget/:itemId')
  deleteBudgetItem(@Param('id') tripId: string, @Param('itemId') itemId: string, @Request() req: any) {
    return this.svc.deleteBudgetItem(tripId, itemId, req.user.sub);
  }

  // ── Packing ────────────────────────────────
  @Get(':id/packing')
  getPacking(@Param('id') tripId: string, @Request() req: any) {
    return this.svc.getPacking(tripId, req.user.sub);
  }

  @Post(':id/packing')
  addPacking(@Param('id') tripId: string, @Request() req: any, @Body() body: any) {
    return this.svc.addPackingItem(tripId, req.user.sub, body);
  }

  @Put(':id/packing/:itemId')
  updatePacking(@Param('id') tripId: string, @Param('itemId') itemId: string, @Request() req: any, @Body() body: any) {
    return this.svc.updatePackingItem(tripId, itemId, req.user.sub, body);
  }

  @Delete(':id/packing/:itemId')
  deletePacking(@Param('id') tripId: string, @Param('itemId') itemId: string, @Request() req: any) {
    return this.svc.deletePackingItem(tripId, itemId, req.user.sub);
  }

  // ── Notes ──────────────────────────────────
  @Get(':id/notes')
  getNotes(@Param('id') tripId: string, @Request() req: any) {
    return this.svc.getNotes(tripId, req.user.sub);
  }

  @Post(':id/notes')
  addNote(@Param('id') tripId: string, @Request() req: any, @Body() body: any) {
    return this.svc.addNote(tripId, req.user.sub, body);
  }

  @Put(':id/notes/:noteId')
  updateNote(@Param('id') tripId: string, @Param('noteId') noteId: string, @Request() req: any, @Body() body: any) {
    return this.svc.updateNote(tripId, noteId, req.user.sub, body);
  }

  @Delete(':id/notes/:noteId')
  deleteNote(@Param('id') tripId: string, @Param('noteId') noteId: string, @Request() req: any) {
    return this.svc.deleteNote(tripId, noteId, req.user.sub);
  }
}
