import AdventureMongoRepository from '../repositories/AdventureMongoRepository';
import AdventureMysqlRepository from '../repositories/AdventureMysqlRepository';
import AdventureLogModel from '../models/AdventureLogModel';

class ReportService {
  private adventureMongoRepository: AdventureMongoRepository;
  private adventureMysqlRepository: AdventureMysqlRepository;

  constructor() {
    this.adventureMongoRepository = new AdventureMongoRepository();
    this.adventureMysqlRepository = new AdventureMysqlRepository();
  }

  async getAdventureLogList(userId: number, page: number, size: number): Promise<AdventureLogModel[]> {
    return this.adventureMysqlRepository.getAdventureLogList(userId, page, size);
  }

  async getAdventureLogDetail(adventureLogId: number): Promise<any> {
    let adventureLog = await this.adventureMysqlRepository.getAdventureLogDetail(adventureLogId);
    adventureLog.gps_log = await this.adventureMongoRepository.getUserLocationData(adventureLog.gps_log_key);
    return adventureLog;
  }
}

export default ReportService;