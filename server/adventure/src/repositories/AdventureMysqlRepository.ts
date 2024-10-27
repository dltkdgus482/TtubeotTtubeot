import connection from "../config/database/mysql";

class AdventureMysqlRepository {
  async initAdventureLog(adventureLog: AdventureLogModel): Promise<number> {
    const [result]: any = await connection.query(
      `INSERT INTO adventure_log (user_ttubeot_ownership_id, user_id) VALUES (?, ?)`,
      [adventureLog.userTtubeotOwnershipId, adventureLog.userId]
    );

    return result.insertId;
  }

  async updateAdventureLog(adventureLog: AdventureLogModel): Promise<void> {
    await connection.query(
      `UPDATE adventure_log SET adventure_distance = ?, adventure_calorie = ?, adventure_coin = ?, start_at = ?, end_at = ?, gps_log = ? WHERE adventure_log_id = ?`,
      [
        adventureLog.adventureDistance,
        adventureLog.adventureCalorie,
        adventureLog.adventureCoin,
        adventureLog.startAt,
        adventureLog.endAt,
        adventureLog.gpsLog,
        adventureLog.adventureLogId,
      ]
    );
  }
}

export default AdventureMysqlRepository;