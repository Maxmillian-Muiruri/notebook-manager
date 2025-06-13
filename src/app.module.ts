import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotebookModule } from './notebook/notebook.module';

@Module({
  imports: [NotebookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
