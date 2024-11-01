import dotenv from 'dotenv';
import ftp from 'ftp';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

dotenv.config();

class FTPUpload {
  private static client: ftp;
  private static host: string = process.env.FTP_HOST || '';
  private static user: string = process.env.FTP_USER || '';
  private static password: string = process.env.FTP_PASSWORD || '';

  private static connect(): Promise<void> {
    this.client = new ftp();
    return new Promise((resolve, reject) => {
      this.client.on('ready', resolve);
      this.client.on('error', reject);
      this.client.connect({
        host: this.host,
        user: this.user,
        password: this.password,
        pasvTimeout: 10000,
      });
    });
  }

  public static async uploadImage(imageBlob: Buffer): Promise<string> {
    const timestamp = Date.now();
    const filename = `${uuidv4()}-${timestamp}.jpeg`;

    await this.connect();

    return new Promise((resolve, reject) => {
      const imageStream = new Readable();
      imageStream.push(imageBlob);
      imageStream.push(null);

      this.client.put(imageStream, `/generated/${filename}`, (err) => {
        this.client.end();
        if (err) {
          reject(err);
        } else {
          resolve(filename);
        }
      });
    });
  }
}

export default FTPUpload;
