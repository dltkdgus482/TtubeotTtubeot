import connection from "../config/database/mysql";
import AdventureLogModel from "../models/AdventureLogModel";

class AdventureImageMysqlRepository {
  constructor() {
    this.initTable();
  }

  async initTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS adventure_image (
        image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        adventure_log_id BIGINT NOT NULL,
        image_url TEXT NOT NULL,
        FOREIGN KEY (adventure_log_id) REFERENCES adventure_log(adventure_log_id)
      )
    `;
    await connection.query(createTableQuery);
  }

  async saveImageUrls(adventureLogId: number, imageUrls: string[]): Promise<void> {
    for (let imageUrl of imageUrls) {
      await connection.query(
        `INSERT INTO adventure_image (adventure_log_id, image_url) VALUES (?, ?)`,
        [adventureLogId, imageUrl]
      );
    }
  }

  async findImageUrlsByAdventureLogId(adventureLogId: number): Promise<string[]> {
    const [rows] = await connection.query(
      `SELECT image_url FROM adventure_image WHERE adventure_log_id = ?`,
      [adventureLogId]
    );
    return (rows as { image_url: string }[]).map((row) => row.image_url);
  }
}

export default AdventureImageMysqlRepository;