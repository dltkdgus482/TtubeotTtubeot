import dotenv from 'dotenv';
import ftp from 'ftp';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

dotenv.config();

class FTPUpload {
  private static instance: FTPUpload;
  private client: ftp;
  private host: string = process.env.FTP_HOST || '';
  private user: string = process.env.FTP_USER || '';
  private password: string = process.env.FTP_PASSWORD || '';
  private connected: boolean = false;

  private constructor() {
    this.client = new ftp();
  }

  public static getInstance(): FTPUpload {
    if (!FTPUpload.instance) {
      FTPUpload.instance = new FTPUpload();
    }
    return FTPUpload.instance;
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      this.client.on('ready', () => {
        this.connected = true;
        resolve();
      });

      this.client.on('error', (error) => {
        this.connected = false;
        reject(error);
      });

      this.client.connect({
        host: this.host,
        user: this.user,
        password: this.password,
        pasvTimeout: 10000,
      });
    });
  }

  public async uploadImage(imageBlob: Buffer): Promise<string> {
    const timestamp = Date.now();
    const filename = `${uuidv4()}-${timestamp}.jpeg`;

    await this.connect();

    return new Promise((resolve, reject) => {
      const imageStream = new Readable();
      imageStream.push(imageBlob);
      imageStream.push(null);

      this.client.put(imageStream, `/generated/${filename}`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(filename);
        }
      });
    });
  }

  public closeConnection(): void {
    if (this.connected) {
      this.client.end();
      this.connected = false;
    }
  }
}

export default FTPUpload;
