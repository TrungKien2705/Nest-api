import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsertNoteDTO, UpdateNoteDTO } from './dto/note.dto';
@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}
  async getNotes(userId: number) {
    const notes = await this.prisma.note.findMany({
      where: {
        userId: userId,
      },
    });
    return {
      msg: 'get Notes',
      data: notes,
    };
  }

  async getNoteById(id: number) {
    const notes = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });
    return notes;
  }

  async insertNote(id: number, data: InsertNoteDTO) {
    const dataNote = await this.prisma.note.create({
      data: {
        ...data,
        userId: id,
      },
    });

    return dataNote;
  }

  async updateNote(id: number, data: UpdateNoteDTO) {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });
    if (!note) {
      throw new ForbiddenException('Note not found');
    }

    const updateNote = await this.prisma.note.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
    return updateNote;
  }

  async deleteNote(id: number) {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });
    if (!note) {
      throw new ForbiddenException('Note not found');
    }
    const deleteNote = await this.prisma.note.delete({
      where: {
        id,
      },
    });
    return deleteNote;
  }
}
