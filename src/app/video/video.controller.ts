import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('videos')
export class VideoController {


  @Get('stream/:filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    const file = fs.createReadStream(path.join(process.cwd(), 'videos', filename));
    return new StreamableFile(file);
  }
  @Get(':filename')
  async streamVideo(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const videoPath = path.join(__dirname, 'videos', filename);

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
