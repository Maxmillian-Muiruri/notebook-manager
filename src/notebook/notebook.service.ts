import { Injectable } from '@nestjs/common';

@Injectable()
export class NotebookService {
  private notebooks: Notebook[] = [];

  constructor(private readonly databaseService: DatabaseService) {}
}
