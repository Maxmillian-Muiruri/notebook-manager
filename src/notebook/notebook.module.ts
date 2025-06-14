import { Module } from '@nestjs/common';
import { NotebookService } from './notebook.service';
import { NotebookController } from './notebook.controller';
import { DatabaseService } from '../database/connection.service';
@Module({
  providers: [NotebookService, DatabaseService],
  controllers: [NotebookController],
})
export class NotebookModule {}
