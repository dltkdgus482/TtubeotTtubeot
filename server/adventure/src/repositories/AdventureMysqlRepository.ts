import connection from "../config/database/mysql";
import AdventureLogModel from "../models/AdventureLogModel";

class AdventureMysqlRepository {
  constructor() {
    this.initTable();
  }

  async initTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS adventure_log (
        adventure_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_ttubeot_ownership_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        adventure_distance INT DEFAULT 0,
        adventure_calorie INT DEFAULT 0,
        adventure_coin INT DEFAULT 0,
        start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        gps_log_key CHAR(24) DEFAULT NULL
      )
    `;
    await connection.query(createTableQuery);
  }

  async initAdventureLog(adventureLog: AdventureLogModel): Promise<number> {
    const [result]: any = await connection.query(
      `INSERT INTO adventure_log (user_ttubeot_ownership_id, user_id) VALUES (?, ?)`,
      [adventureLog.userTtubeotOwnershipId, adventureLog.userId]
    );

    return result.insertId;
  }

  async updateAdventureLog(adventureLog: AdventureLogModel): Promise<void> {
    await connection.query(
      `UPDATE adventure_log SET adventure_distance = ?, adventure_calorie = ?, adventure_coin = ?, end_at = ?, gps_log_key = ? WHERE adventure_log_id = ?`,
      [
        adventureLog.adventureDistance,
        adventureLog.adventureCalorie,
        adventureLog.adventureCoin,
        adventureLog.endAt,
        adventureLog.gpsLogKey,
        adventureLog.adventureLogId,
      ]
    );
  }

  async getAdventureLogList(userId: number, page: number, size: number): Promise<any[]> {
    const [result]: any = await connection.query(
      `SELECT * FROM adventure_log WHERE user_id = ? ORDER BY adventure_log_id ASC LIMIT ?, ?`,
      [userId, (page - 1) * size, size]
    );

    // change snake_case to camelCase
    return result;
  }

  async getAdventureLogDetail(adventureLogId: number): Promise<any> {
    const [result]: any = await connection.query(
      `SELECT * FROM adventure_log WHERE adventure_log_id = ?`,
      [adventureLogId]
    );

    return result[0];
  }
}

export default AdventureMysqlRepository;