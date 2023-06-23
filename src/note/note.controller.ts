import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { NoteService } from './note.service';
import { InsertNoteDTO, UpdateNoteDTO } from './dto/note.dto';

declare module 'express' {
  export interface Request {
    user: any;
  }
}
@UseGuards(MyJwtGuard)
@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get()
  getNotes(@Req() request: Request) {
    return this.noteService.getNotes(request.user.id);
  }

  @Get(':id')
  getNoteById(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.getNoteById(id);
  }

  @Post()
  insertNote(@Req() request: Request, @Body() data: InsertNoteDTO) {
    return this.noteService.insertNote(request.user.id, data);
  }

  @Put(':id')
  updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNoteDTO,
  ) {
    return this.noteService.updateNote(id, data);
  }

  @Delete(':id')
  deleteNote(@Param('id', ParseIntPipe) id: number) {
    return this.noteService.deleteNote(id);
  }
}
