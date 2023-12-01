import { logTrace } from '@/common/logger';
import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('videos')
export class VideoController {


  @Get('stream/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response): StreamableFile {
    
    const videoPath = path.join(process.cwd(), 'assets', filename);
    if (!fs.existsSync(videoPath)) {
      res.status(404).send('Video not found');
      return;
    }
    const file = fs.createReadStream(videoPath);
    return new StreamableFile(file);
  }
  @Get(':filename')
  async streamVideo(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const videoPath = path.join(process.cwd(), 'assets', filename);
    // logTrace("video path workdir", __dirname)
    if (!fs.existsSync(videoPath)) {
      res.status(404).send('Video not found');
      return;
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    // const range = req.headers.range;

    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);

    const videoStream = fs.createReadStream(videoPath);
    videoStream.pipe(res);
  }
}
