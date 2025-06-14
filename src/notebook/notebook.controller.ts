import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { NotebookService } from './notebook.service';
import { CreateNotebookDto } from './dtos/create-notebook.dtos';
import { UpdateNotebookDto } from './dtos/update-notebook.dtos';
import { Notebook } from './interfaces/notebook.interfaces';

@Controller('notebook')
export class NotebookController {
  constructor(private readonly notebookService: NotebookService) {}

  @Post()
  async create(@Body() data: CreateNotebookDto): Promise<Notebook> {
    return this.notebookService.create(data);
  }

  @Get()
  async findAll(): Promise<Notebook[]> {
    return this.notebookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Notebook> {
    return this.notebookService.findOne(Number(id));
  }

  @Get('title/:title')
  async findByTitle(@Param('title') title: string): Promise<Notebook> {
    return this.notebookService.findByTitle(title);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateNotebookDto,
  ): Promise<Notebook> {
    return this.notebookService.update(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.notebookService.delete(Number(id));
  }
}
