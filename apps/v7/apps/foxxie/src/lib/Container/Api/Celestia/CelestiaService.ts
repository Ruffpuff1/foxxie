import { VillagerBuilders } from './Builders/VillagerBuilders';
import { CelestiaRepository } from './Repositories/CelestiaRepository';

export class CelestiaService {
    public celestiaRepository = new CelestiaRepository();

    public villagerBuilders = new VillagerBuilders();
}
